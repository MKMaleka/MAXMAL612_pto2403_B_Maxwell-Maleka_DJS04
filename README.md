# DJS04 Project Brief: Book Connect - Abstractions

#### Discussion and Reflection

### Challenges encountered while converting the book preview and other elements into Web Components.
- Deciding what goes in a component, it involved deciding which parts were worth making into components versus keeping them in the regular HTML and JavaScript.
- Getting the style right, Shadown DOM was new and took time to understand to make sure each component had its own look without messing up the rest of the page.

### The rationale behind selecting certain elements for conversion into Web Components.
- Since book previews all looked similar and had the same structure e.g cover, tittle, and author turning it into a component meant I could use it again without rewriting the code each time.
- Parts, like buttons or pop-ups that appeared often, made sense as components too. This kept the code organized and meant I could adjust styles or behavior in one place, and it would update everywhere.

### Insights gained about the advantages and limitations of using Web Components in web development.

Advantages
- Since each component handles its own appearance and behavior, it’s easier to make changes without breaking the rest of the app.
- Web Components keep their style and structure separate, making them easy to reuse without causing layout issues.

Limitations
- Web Components required learning new methods for styling and passing data, which is still a bit challenging for me.
-  Web Components require extra code to handle data properly.




