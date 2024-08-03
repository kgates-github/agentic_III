import React, {useEffect, useState} from 'react';
import { testContent, testContentSummary } from './helpers';

function OpenAITests(props) {
  const [themes, setThemes] = useState([]);

  async function getSuggestions() {
    try {
      console.log("Calling openAI...")
      //console.time("getFunctionCall");
      const completion = await props.openAI.chat.completions.create({
        messages: [
          {
            "role": "system", 
            "content": "You are a helpful assistant who can help users find Wikipedia pages they might like to read based on their interests."
          },
          {
            "role": "user", 
            "content": `First, read the following content:\n\n${testContentSummary}\n\n
              After that, create a JSON-formatted list of up to 5 themes found in the content and links to wikipedia pages that are related to each theme. Try to take into account that the user is interested in the following interests: "science", "important inventions", "film noir", "aviation". For each answer, how the wikipedia page is related to the wikipedia content and the user's interests. Write in a neutral third-person voice that is targeted to a user browsing Wikipedia. Don't refer to "the user" or say "content". Only include links that relate to the content.\n\n 
              Return the results as a JSON array. Do not include any additional text or formatting.
              JSON format: [
                {"theme": "theme1", "wikiPage": "wikiPage1", "reasoning": "reasoning1"}, 
                {"theme": "theme2", "wikiPage": "wikiPage2", "reasoning": "reasoning1"},
                ...
              ]
              JSON Output:
            `
          }, 
        ],
        model: "gpt-4o-mini",
      });
      //console.timeEnd("getFunctionCall"); 
    
      const message = completion.choices[0].message.content.trim();
      const formattedJSON = JSON.parse(message);
      setThemes(formattedJSON); 
    } catch (error) {
      console.log("Error parsing JSON: ", error.message);
    }
  }

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <div 
      onClick={() => { getSuggestions() }}
      style={{
        display: 'flex', 
        flexDirection: 'row',
        position:"fixed", 
        top:0, 
        left:0, 
        width:"100%", 
        height:"100%", 
        background:"#1c1c1c",
        zIndex:1000,
        cursor:"pointer",
      }}
    >
      <div style={{
        color:"#fff",
        background:"#1c1c1c",
        marginTop:"100px",
        marginLeft:"40px",
        paddingLeft:"28px",
        paddingRight:"28px",
        paddingTop:"40px",
        paddingBottom:"40px",
        borderRadius:"8px",
        border:"1px solid #555",
        display:"flex",
        width:"600px",
        height:"calc(100vh - 240px)",
      }}>
        <div style={{ flex:1, }}>
          <h1>OpenAI Tests</h1>
          <div style={{ marginTop:"20px", }}>
            <h2>Themes</h2>
            <ul>
              {themes.map((theme, index) => {
                return (
                  <li key={index} style={{marginBottom:"20px"}}>
                    <div style={{lineHeight:"1.5em"}}>
                      <div style={{ fontWeight:"600", textTransform:"capitalize"}}>{theme.theme}</div>
                      <div style={{ marginLeft:"0px", color:"#ccc"}}>{theme.reasoning}</div>
                      <div style={{ marginLeft:"0px", color:"#888"}}>
                        {theme.wikiPage}    
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OpenAITests;




