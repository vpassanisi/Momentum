# Momentum

This is a full stack application using Vue, TypeScript, Go, Python, Node, Graphql, MongoDB and Docker Compose. The backend architecture is a graphql api gateway and many microservices. It is a clone of Reddit! So you can create subreddits, make posts to those subreddits, and have comment conversations within a post. There is also a points system where users can upvote or downvote posts and comments and subsequently sort post and comments by their points. The Frontend is fully responsive and looks great on desktop and mobile.

### Technologies Used:

- Vue
- TypeScript
- Tailwindcss
- Go
- Python
- Node
- Koa
- Graphql
- MongoDB
- Docker and Docker-Compose

### Features

- **Fully Responsive:** I used CSS Grid and FlexBox to make every page work well on any screen size. On desktop there is a navbar at the top of the page and on mobile there is a hanburger menu and sidebar for navigation.
- **Dark Mode:** You can toggle between light and dark mode with the toggle switch at the top of the page. The theme switching works accross the enire site, and the app asks the browser if it prefers dark mode and will automatical engage it if true.
- **Subdirectory Specific Themes:** Each Subdirectory (subreddit) has its own theme colors that are loaded with the data for that subdirectory, and components can use those theme colors. light and dark versions of the theme are programatically generated when creating the subdirectory.
- **Collapse Comment Threads:** Just like reddit, you can click on the line next to a thread of comment to collapse them!
- **Fast Comment Threads:** Comments are stored in the database as separate documents, with references describing where in the comment thread they belong. It was important for me to retrieve and organise comments in linear time complexity. So, comments service builds an object that maps how the comments should be rendered. In this way comment threads could scale to very lage numbers of comments without any problem. Points are also tracked in a similar way.

### Todo

- sometimes the comments service does not order the comments correctly. I have tested the problem down to the mongodb go driver. The output of the dirver is not always stable. It is a rare problem but it could be a problem with how the driver handles aggregation.
- users need roles for subdirectories and the ability to delete and edit posts/comments
- ai inference for sentiment of comments and posts
