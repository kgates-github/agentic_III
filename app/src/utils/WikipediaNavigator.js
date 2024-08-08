class WikipediaNavigator {
  constructor(
    setWikiPages, scroll_x, scrollXControls, 
    setCurIndex, GLOBAL_WIDTH, 
    setPageQueueLength, openAI,
    setWikiPageSummary, setWikiPageDescription,
    setWikiPageTitle, setWikiPageTableOfContents) {
    
    this.pageQueue = [];
    this.queueIndex = 0;
    this.count = 0;
    this.setWikiPages = setWikiPages;
    this.scroll_x = scroll_x;
    this.scrollXControls = scrollXControls;
    this.setCurIndex = setCurIndex;
    this.history = [];
    this.width = GLOBAL_WIDTH.current
    this.setPageQueueLength = setPageQueueLength;
    this.openAI = openAI;
    this.setWikiPageSummary = setWikiPageSummary;
    this.setWikiPageDescription = setWikiPageDescription;
    this.setWikiPageTitle = setWikiPageTitle;
    this.setWikiPageTableOfContents = setWikiPageTableOfContents;
  }

  addPageToQueue = async(wikiPage, moveForward = true) => {
    this.count++;

    // If we are trying to add a page to the queue that is not the last page in the queue
    if (this.queueIndex < this.pageQueue.length - 1) {
      this.pageQueue = this.pageQueue.slice(0, this.queueIndex + 1);
    }

    const newPageID = `wikipage_${this.count}`;
    // TO DO: Add placeholder suggestions and next page.
    // Create promise and when it is ready, update both.
    const newPage = {
      wikiPage: wikiPage,
      prevWikiPage: this.pageQueue[this.queueIndex] ? this.pageQueue[this.queueIndex].wikiPage : null,
      title: wikiPage.replace(/_/g, ' '),
      id: newPageID,
      doRender: true,
      isCurPage: false,
      url: `https://en.wikipedia.org/wiki/${wikiPage}`,
      api: `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=text&format=json`,
      summary: null,
      description: null,
      wordCount: null, 
      suggestions: null,
      tableOfContents: null,
    }

    try {
      const newSummary = await this.fetchWikiSummary(wikiPage);
      newPage.summary = newSummary.summary;
      newPage.title = newSummary.title;
      newPage.description = newSummary.description;
      if (moveForward)  {
        this.setWikiPageSummary(newPage.summary)
        this.setWikiPageDescription(newPage.description)
        this.setWikiPageTitle(newPage.title)
      }
    } catch (error) {
      newPage.summary = error;
    }

    try {
      const tableOfContents = await this.fetchTableOfContents(wikiPage);
      newPage.tableOfContents = tableOfContents;
      if (moveForward) this.setWikiPageTableOfContents(tableOfContents);
    } catch (error) {
      newPage.summary = error;
    }

    if (this.openAI) {
      new Promise((resolve, reject) => {
        resolve(this.getSuggestions(wikiPage));
      }).then((suggestions) => { 
        newPage.suggestions = suggestions;
        console.log('Suggestions are ready:', suggestions);

        // If we have suggestions and we are moving forward, 
        if (suggestions.length && moveForward) {
          this.setNextPage(newPage)
        }
      });
    }
    
    this.pageQueue.push(newPage);

    // If we only have one page, render it
    if (this.pageQueue.length === 1) {
      this.setDoRender();
      this.queueIndex = 0;

      // Set the current index to trigger renders
      this.setCurIndex(this.queueIndex) 
    }  

    this.history.push({ 
      nodeId: newPage.id, 
      parentId: this.pageQueue.length === 1 ? null : this.pageQueue[this.queueIndex].id, 
      linkPosition: 50, 
      name: newPage.title,
      wordCount: 100, // Placeholder until we load content
    });
    
    this.setPageQueueLength(this.pageQueue.length);
    this.setWikiPages(this.pageQueue);
    if (moveForward) this.moveForward(false);
  }

  updateHistory(wikiPage) {
    // Find the history object with the matching ID
    const historyWikiPage = this.history.find(item => item.nodeId === wikiPage.id);
    if (historyWikiPage) {
      historyWikiPage.wordCount = wikiPage.wordCount; 
      historyWikiPage.title = wikiPage.title;
    }
  }

  setDoRender(renderNextPage = true) {
    // Render the current page and the pages before and after it
    this.pageQueue.map((page, index) => {
      page.doRender = index === this.queueIndex || 
        index === this.queueIndex - 2 || 
        index === this.queueIndex - 1 || 
        (index === this.queueIndex + 1 && renderNextPage) ||
        (index === this.queueIndex + 2 && renderNextPage);
      page.isCurPage = index === this.queueIndex;
    });
  }

  setNextPage(curPage) {
    
    for (const suggestion of curPage.suggestions) {
      const newWikiPage = suggestion.wikiPage.split('/').pop();
      const isInQueue = this.pageQueue.some(page => newWikiPage === page.wikiPage);

      if (!isInQueue) {
        this.addPageToQueue(newWikiPage, false);
        return;
      }
    }
    this.addPageToQueue('Dymaxion', false);
  }

  moveForward(renderNextPage = true) {
    if (this.queueIndex === this.pageQueue.length - 1) return;
    this.queueIndex++;
    const curPage = this.pageQueue[this.queueIndex];
    this.setWikiPageSummary(curPage.summary)
    this.setWikiPageDescription(curPage.description)
    this.setWikiPageTitle(curPage.title)
    this.setWikiPageTableOfContents(curPage.tableOfContents);

    // Load suggestions for the next page. If they are not ready, keep trying.
    if (this.openAI) {
      if (curPage && curPage.suggestions && curPage.suggestions.length && this.pageQueue[this.queueIndex+1] === undefined) { 
        this.setNextPage(curPage);
      } else {
        let tries = 0;
        let intervalRef;

        intervalRef = setInterval(() => {
          tries++;
          console.log('Trying to get suggestions for next page. Tries:', tries);
          
          if (curPage && curPage.suggestions && curPage.suggestions.length && this.pageQueue[this.queueIndex+1] === undefined) { 
            this.setNextPage(curPage);
            clearInterval(intervalRef);
          } else if (tries >= 20) {
            clearInterval(intervalRef);
            console.error('Maximum number of tries reached. Suggestions are still null.');
          }
        }, 500); // Check every 100 milliseconds
      }
    }
    this.setCurIndex(this.queueIndex) 
    this.setDoRender(renderNextPage); 
    this.setWikiPages(this.pageQueue);
    
    this.scroll_x.current -= this.width;
    this.scrollXControls.start({ 
      x: this.scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  }

  moveBack() {  
    if (this.queueIndex <= 0) return;
    this.queueIndex--;

    const curPage = this.pageQueue[this.queueIndex];
    this.setWikiPageSummary(curPage.summary)
    this.setWikiPageDescription(curPage.description)
    this.setWikiPageTitle(curPage.title)
    this.setWikiPageTableOfContents(curPage.tableOfContents)
    this.setCurIndex(this.queueIndex)
    this.setDoRender();
    this.setWikiPages(this.pageQueue);

    this.scroll_x.current += this.width;
    this.scrollXControls.start({ 
      x: this.scroll_x.current, 
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }  
    });
  }

  getCurPage() {
    return this.pageQueue[this.queueIndex];
  }

  getHistory() {
    return this.history;
  }

  getBackButtonDisabled() {
    return this.queueIndex === 0;
  }

  getForwardButtonDisabled() {
    return this.queueIndex === this.pageQueue.length - 1;
  }

  handleLinkClick(href) {
    const wikiPage = href.split('/').pop();
    console.log('handleLinkClick', wikiPage);
    this.addPageToQueue(wikiPage);
  }

  fetchWikiSummary = async(wikiPage) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`
      );

      const data = await response.json();
      return {summary: data.extract, title: data.title, description: data.description};
    } catch (error) {
      console.log('fetchWikiSummary error: ', error.message);
    }
  }

  fetchTableOfContents = async(wikiPage) => {
    //https://en.wikipedia.org/w/api.php?action=parse&page=Humanism&prop=sections
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${wikiPage}&prop=sections&format=json&origin=*`
      );

      const data = await response.json();
      console.log('fetchTableOfContents', data.parse.sections);
      return data.parse.sections;
    } catch (error) {
      console.log('fetchWikiSummary error: ', error.message);
    }
  }

  getSuggestions = async(wikiPage) => {
    const newWikiSummary = await this.fetchWikiSummary(wikiPage);

    if (this.openAI) {
      try {
        const completion = await this.openAI.chat.completions.create({
          messages: [
            {
              "role": "system",
              "content": "You are a helpful assistant who can help users find Wikipedia pages they might like to read based on their interests."
            },
            {
              "role": "user",
              "content": `First, read the following excerpt:\n\n${newWikiSummary.summary}\n\n
                After that, create a JSON-formatted list of up to 5 valid links to Wikipedia pages that would be good follow-ups to the excerpt. 
                - For each Wikipedia page, write a short 25-word summary.\n\n 
                - Do not include the current page in the list of suggestions.\n\n
                - Make sure JSON is formatted correctly. Example: \n\n
                JSON format: [
                  {"title": "title1", "wikiPage": "wiki_page_1", "summary": "summary1", "topics": ["topic1", "topic2", "topic3"]}, 
                  {"title": "title2", "wikiPage": "wiki_page_2", "summary": "summary2", "topics": ["topic1", "topic2", "topic3"]},
                  ...
                ]
                JSON Output:`
            },
          ],
          model: "gpt-4o-mini",
        });

        const message = completion.choices[0].message.content.trim();
        const sanitizedMessage = message.replace(/```json|```/g, '').trim();
        const formattedJSON = JSON.parse(sanitizedMessage);

        console.log('-----------------------------------------------');
        console.log('formattedJSON:', formattedJSON);
        console.log('-----------------------------------------------');
        return formattedJSON;
      } catch (error) {
        console.log("Error parsing JSON: ", error.message);
        return {error: error.message};  
      }
    }
  }
}

export default WikipediaNavigator;