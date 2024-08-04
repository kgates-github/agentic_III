class WikipediaNavigator {
  constructor(
    setWikiPages, scroll_x, scrollXControls, 
    setCurIndex, GLOBAL_WIDTH, 
    setPageQueueLength, openAI) {
    
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
  }

  addPageToQueue(wikiPage, moveForward = true) {
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
      summary: 'This is a summary',
      wordCount: null, 
      suggestions: null,
    }

    new Promise((resolve, reject) => {
      resolve(this.getSuggestions(wikiPage));
    }).then((suggestions) => { 
      newPage.suggestions = suggestions;
      console.log('Suggestions are ready:', suggestions);

      // If we have suggestions and we are moving forward, 
      // add the random suggestion to the queue
      if (suggestions.length && moveForward) {
        const randIndex = Math.floor(Math.random() * suggestions.length);
        const nextWikiPage = suggestions[randIndex].wikiPage.split('/').pop();
        console.log('------> nextWikiPage', nextWikiPage);
        this.addPageToQueue(nextWikiPage, false);
      }
    });
    
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

  moveForward(renderNextPage = true) {
    if (this.queueIndex === this.pageQueue.length - 1) return;
    this.queueIndex++;

    const curPage = this.pageQueue[this.queueIndex];
    if (curPage.suggestions && curPage.suggestions.length) {
      console.log('==> curPage.suggestions', curPage.suggestions);  
      const randIndex = Math.floor(Math.random() * curPage.suggestions.length);
      const nextWikiPage = curPage.suggestions[randIndex].wikiPage.split('/').pop();
      this.addPageToQueue(nextWikiPage, false);
    } else {
      // TO DO: Set interval to check for suggestions
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
    //console.log('handleLinkClick', href);
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
      return data.extract;
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
              "content": `First, read the following excerpt:\n\n${newWikiSummary}\n\n
                After that, create a JSON-formatted list of up to 5 links to wikipedia pages that would be good follow-ups to the excerpt. For each wikipedia page, write a short 30-word summary.\n\n 
                Return the results as a JSON array. Do not include any additional text or formatting.
                JSON format: [
                  {"title": "title1", "wikiPage": "wikiPage1", "summary": "summary1",}, 
                  {"title": "title2", "wikiPage": "wikiPage2", "summary": "summary2",},
                  ...
                ]
                JSON Output:`
            }, 
          ],
          model: "gpt-4o-mini",
        });
        
        const message = completion.choices[0].message.content.trim();
        const formattedJSON = JSON.parse(message);
        
        return formattedJSON;
      } catch (error) {
        console.log("Error parsing JSON: ", error.message);
        return {error: error.message};  
      }
    }
  }
}

export default WikipediaNavigator;