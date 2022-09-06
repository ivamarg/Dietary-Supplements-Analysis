# Dietary-Supplements-Analysis
Research article on dietary supplements based on iHerb data.

The iHerb supplement research is an analysis of the popularity and effectiveness of vitamins, minerals, amino acids, fats and natural supplements based on user ratings. In addition, the work contains an independent analysis of well-known brands, the cost and quality of their products. The project was created to improve nutrition and health education.

## Technology
Data for analysis and plotting was obtained using HTML parser Beautiful Soup. The web page displays the received information in the form of interactive graphs created using the D3.js. 

HTML, CSS and Javascript files were created to display the client. The web page consists of several parts: 
- general information about food additives and their types;
- information about the research done and the technologies used;
- displaying the obtained analysis conclusions in the form of a description and various graphs;
- useful information with links to other sources.

For the design and functionality of the page, tools such as Bootstrap, Swiper, jQuery were also used.

## Data
The parser returns a CSV file with the following information for each item:
- General category (Vitamins, Minerals, Amino-Acids, etc.)
- Sub-category (Vitamin-D, Iodine, L-Taurine, etc.)
- Full trade name
- Brand name (Now Foods, California Gold Nutrition, etc.)
- Rating (5 stars maximum)
- Number of reviews
- Serving size
- The composition of one serving (for complex supplements)

## Result
![demo](https://user-images.githubusercontent.com/112548290/188622606-4899c32f-a117-4ed7-81cf-ea947dfa8095.gif)
