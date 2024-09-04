import React, { useMemo, useState, useRef, useEffect } from 'react';
import { stringToColor, subjectAreas } from './helpers';
import * as d3 from 'd3';

function HistoryViewer(props) {
  const [subjectAreasByWikiPage, setSubjectAreasByWikiPage] = useState([]);
  const [height, setHeight] = useState(0);
  const [dataStack, setDataStack] = useState(null);
  const svgRef = useRef(null);

  const getColor = (subjectArea) => {
    const rgb = stringToColor(subjectArea);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
  }

  const parseDate = d3.timeFormat("%Y-%m-%d");

  function getDateFromIndex(index) {
    const baseDate = new Date("2023-01-01");
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + index);
    return parseDate(newDate);
  }

  useEffect(() => {
    const history = props.navigator.getHistory();
    const temp = [];
    let test_set = [];
    const test_keys = {};

    history.forEach((wikiPage, index) => {
      const page = {date: getDateFromIndex(index)};
      if (wikiPage.suggestions) {
        wikiPage.suggestions.forEach((suggestion) => {
          let key = suggestion.subjectArea.replace(/ /g, '_');
          test_keys[key] = 1;
          if (key in page) {
            page[key]++;
          } else {
            page[key] = 1;
          }
        });
      }
      test_set.push(page);
    });

    // Parse dates and fill in missing dates with 0 values
    const parseDate = d3.timeParse("%Y-%m-%d");

    test_set.forEach(d => {
      d.date = parseDate(d.date);
      Object.keys(test_keys).forEach(key => {
        if (!(key in d)) {
          d[key] = 0;
        }
      });
    });

    const stackData = d3.stack()
      .keys(Object.keys(test_keys)) 
      .order(d3.stackOrderNone) 
      .offset(d3.stackOffsetWiggle); 

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const margin = { top: 20, right: 0, bottom: 30, left: 0 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    const x = d3.scaleTime()
      .domain(d3.extent(test_set, d => d.date))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([-8, 8])
      .range([height, 0]);
    
    /*
    d3.scaleOrdinal(d3.schemeCategory10)
    d3.scaleOrdinal(d3.schemeAccent)
    d3.scaleOrdinal(d3.schemeDark2)
    d3.scaleOrdinal(d3.schemePaired)
    d3.scaleOrdinal(d3.schemePastel1)
    d3.scaleOrdinal(d3.schemePastel2)
    d3.scaleOrdinal(d3.schemeSet1)
    d3.scaleOrdinal(d3.schemeSet2)
    d3.scaleOrdinal(d3.schemeSet3)
    */
    const color = d3.scaleOrdinal(d3.schemePaired)

    const area = d3.area()
      .curve(d3.curveBasis)
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const data = stackData(test_set)
    console.log('test_set = ', test_set)
    console.log('data = ', data)

    //y.domain([0, 5]);

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('d', area)
      .attr('fill', d => color(d.key));

    /*svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y));*/
  }, [props.tab]);
  
  return (
    <div style={{
      width:"100%", 
      marginBottom:"20px", 
      marginLeft:"0px",  
      background:'none', 
      height:"calc(100vh - 150px)",
      overflowY:"scroll",
    }}>
      <div>
        <svg ref={svgRef} width="1860" height="800" style={{background:"none", filter: "grayscale(100%)"}}></svg>
      </div>
      {subjectAreasByWikiPage && subjectAreasByWikiPage.map((wikiPage, index) => (
        <div style={{display:"flex", flexDirection:"row", marginBottom:"1px"}}>
        <div style={{fontWeight:400, width:"200px", height:"2px"}}>
          <div>{wikiPage.title}</div>
          {/*<div style={{color:"#999", fontSize:"11px"}}>{wikiPage.datetime}</div>*/}
        </div>
        {Object.entries(wikiPage.subjectAreas).map(([key, value, index]) => (
          <div key={index} 
            style={{
              width:value*80+"px", 
              background:stringToColor(key), 
              background: getColor(key),
              marginRight:"1px", 
              overflow:"hidden",
              height:"24px",
              padding:"2px",
              color:"#fff",
            }}>
            <span>{key} </span>
          </div>
        ))}
        </div>
      ))}
    </div>
  );
}

export default HistoryViewer;


/*
    
    get all topics
    then get themes for each topic in a look up table

    [
      { 
        wikiPage: some_page,
        summary: 'some summary',
        id: 'some_id',
        themes: {
          'arts': {
            name: 'Arts',
            value: 1,
            suggestions: [
              { title: 'some title', summary: 'some summary', topics: ['arts', 'painting'] }
            ]
          },
        }
       
      }
    ]

    */

