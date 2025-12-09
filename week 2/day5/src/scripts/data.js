const QUIZ_DATA = [
  {
    id: 1,
    title: "HTML Quiz",
    category: "HTML",
    description: "Test HTML knowledge",
    img: './images/quiz/html.jpg',
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks Text Mark Language", "Hyper Tool Markup Language"],
        correct: 0
      },
      {
        question: "Which HTML element is used for the largest heading?",
        options: ["h6", "h1", "heading", "header"],
        correct: 1
      },
      {
        question: "What is the correct HTML element for inserting a line break?",
        options: ["lb", "br", "break", "newline"],
        correct: 1
      },
      {
        question: "Which attribute specifies the URL of a link?",
        options: ["link", "href", "src", "url"],
        correct: 1
      },
      {
        question: "Which HTML element defines the title of a document?",
        options: ["title", "meta", "head", "header"],
        correct: 0
      },
      {
        question: "What is the correct HTML element for playing video files?",
        options: ["video", "movie", "media", "film"],
        correct: 0
      },
      {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["style", "class", "styles", "css"],
        correct: 0
      },
      {
        question: "What is the correct HTML for making a checkbox?",
        options: ["input type checkbox", "checkbox", "check", "input check"],
        correct: 0
      },
      {
        question: "Which HTML element is used to specify a footer?",
        options: ["footer", "bottom", "section", "end"],
        correct: 0
      },
      {
        question: "What is the correct HTML for creating a hyperlink?",
        options: ["a href", "link", "url", "hyperlink"],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    title: "CSS Quiz",
    category: "CSS",
    description: "Test CSS knowledge",
    img: './images/quiz/css.webp',
    questions: [
      {
        question: "What does CSS stand for?",
        options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
        correct: 0
      },
      {
        question: "Where should CSS be placed in HTML?",
        options: ["head section", "body section", "footer section", "anywhere"],
        correct: 0
      },
      {
        question: "Which HTML tag is used for internal CSS?",
        options: ["style", "css", "script", "link"],
        correct: 0
      },
      {
        question: "Which property changes background color?",
        options: ["background-color", "color", "bgcolor", "bg-color"],
        correct: 0
      },
      {
        question: "Which CSS property changes text color?",
        options: ["color", "text-color", "font-color", "text"],
        correct: 0
      },
      {
        question: "Which CSS property controls text size?",
        options: ["font-size", "text-size", "size", "font"],
        correct: 0
      },
      {
        question: "How do you make text bold in CSS?",
        options: ["font-weight bold", "text-weight bold", "font bold", "weight bold"],
        correct: 0
      },
      {
        question: "How do you remove underline from links?",
        options: ["text-decoration none", "underline none", "decoration none", "link none"],
        correct: 0
      },
      {
        question: "Which property changes font family?",
        options: ["font-family", "font", "family", "typeface"],
        correct: 0
      },
      {
        question: "How do you center text in CSS?",
        options: ["text-align center", "align center", "center text", "text center"],
        correct: 0
      }
    ]
  },
  {
    id: 3,
    title: "JavaScript Quiz",
    category: "JavaScript",
    description: "Test JavaScript knowledge",
    img: './images/quiz/javascript.jpg',
    questions: [
      {
        question: "Inside which HTML element do we put JavaScript?",
        options: ["script", "javascript", "js", "code"],
        correct: 0
      },
      {
        question: "How do you write Hello World in an alert box?",
        options: ["alert Hello World", "msg Hello World", "alertBox Hello World", "popup Hello World"],
        correct: 0
      },
      {
        question: "How do you create a function in JavaScript?",
        options: ["function myFunction", "create myFunction", "def myFunction", "function = myFunction"],
        correct: 0
      },
      {
        question: "How do you call a function named myFunction?",
        options: ["myFunction()", "call myFunction", "run myFunction", "execute myFunction"],
        correct: 0
      },
      {
        question: "How do you write an IF statement in JavaScript?",
        options: ["if (condition)", "if condition then", "if condition", "when condition"],
        correct: 0
      },
      {
        question: "Which operator is used to assign a value?",
        options: ["=", "==", "===", ":="],
        correct: 0
      },
      {
        question: "What will the following code return: Boolean(10 > 9)?",
        options: ["true", "false", "1", "0"],
        correct: 0
      },
      {
        question: "Which event occurs when the user clicks on an HTML element?",
        options: ["onclick", "onchange", "onmouseclick", "onmouseover"],
        correct: 0
      },
      {
        question: "How do you declare a JavaScript variable?",
        options: ["var carName", "variable carName", "v carName", "declare carName"],
        correct: 0
      },
      {
        question: "Which method can be used to find the length of a string?",
        options: ["length", "size", "len", "count"],
        correct: 0
      }
    ]
  },
  {
    id: 4,
    title: "React Quiz",
    category: "React",
    description: "Test React knowledge",
    img: './images/quiz/react.jpg',
    questions: [
      {
        question: "What is React?",
        options: ["JavaScript library", "Database", "Web server", "CSS framework"],
        correct: 0
      },
      {
        question: "What is JSX?",
        options: ["JavaScript XML", "Java Syntax", "JSON XML", "JavaScript Extension"],
        correct: 0
      },
      {
        question: "How do you create a React component?",
        options: ["class Component extends React.Component", "React.createComponent", "new React.Component", "React.component"],
        correct: 0
      },
      {
        question: "What is used to pass data to a component?",
        options: ["props", "state", "data", "parameters"],
        correct: 0
      },
      {
        question: "How do you update component state?",
        options: ["setState", "updateState", "changeState", "modifyState"],
        correct: 0
      },
      {
        question: "What is the default port for React development server?",
        options: ["3000", "8080", "3001", "8000"],
        correct: 0
      },
      {
        question: "Which lifecycle method is called after component mounts?",
        options: ["componentDidMount", "componentWillMount", "componentMounted", "componentLoaded"],
        correct: 0
      },
      {
        question: "What does the key prop do?",
        options: ["Identifies list items", "Unlocks components", "Provides security", "Sets ID"],
        correct: 0
      },
      {
        question: "How do you handle events in React?",
        options: ["onClick={handleClick}", "onclick=handleClick", "onClick=handleClick()", "click=handleClick"],
        correct: 0
      },
      {
        question: "What is a React Hook?",
        options: ["Function that lets you use state", "Class method", "Component lifecycle", "Event handler"],
        correct: 0
      }
    ]
  },
  {
    id: 5,
    title: "Node.js Quiz",
    category: "Node.js",
    description: "Test Node.js knowledge",
    img: './images/quiz/node.jpg',
    questions: [
      {
        question: "What is Node.js?",
        options: ["JavaScript runtime", "Web browser", "Database", "CSS framework"],
        correct: 0
      },
      {
        question: "What is npm?",
        options: ["Node Package Manager", "New Project Manager", "Node Project Manager", "Network Package Manager"],
        correct: 0
      },
      {
        question: "Which method is used to include modules?",
        options: ["require", "include", "import", "load"],
        correct: 0
      },
      {
        question: "What is the file extension for Node.js files?",
        options: [".js", ".node", ".nodejs", ".n"],
        correct: 0
      },
      {
        question: "Which object represents the current process?",
        options: ["process", "current", "proc", "node"],
        correct: 0
      },
      {
        question: "What is Express.js?",
        options: ["Web application framework", "Database", "Template engine", "Testing framework"],
        correct: 0
      },
      {
        question: "Which method creates a server?",
        options: ["http.createServer", "server.create", "http.server", "createServer"],
        correct: 0
      },
      {
        question: "What is the default port for HTTP?",
        options: ["80", "8080", "3000", "443"],
        correct: 0
      },
      {
        question: "Which is used for asynchronous programming?",
        options: ["All of the above", "Callbacks", "Promises", "Async/Await"],
        correct: 0
      },
      {
        question: "What does REPL stand for?",
        options: ["Read Eval Print Loop", "Read Execute Print Loop", "Run Eval Print Loop", "Read Eval Process Loop"],
        correct: 0
      }
    ]
  }
];

const Storage = {
  getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
  saveUser: (user) => {
    const users = Storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },
  updateUser: (updatedUser) => {
    const users = Storage.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  },
  findUser: (email, password) => {
    const users = Storage.getUsers();
    return users.find(u => u.email === email && u.password === password);
  },
  getUserResults: (userId) => {
    return JSON.parse(localStorage.getItem(`results_${userId}`) || '[]');
  },
  saveResult: (userId, result) => {
    const results = Storage.getUserResults(userId);
    results.push(result);
    localStorage.setItem(`results_${userId}`, JSON.stringify(results));
  }
};