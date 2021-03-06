const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')
const Todo = mongoose.model("Todo", {
  text: String,
  complete: Boolean,
});

mongoose.connect("mongodb://localhost:27017/my_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database Connected!");
});

const typeDefs = `
  type Query {
    hello(name: String): String!
    todo:[Todo]
  }
  type Todo{
      id:ID
      text:String!
      complete:Boolean!
  }
  type Mutation {
      createTodo(text: String!):Todo
      updateTodo(id:ID!,complete:Boolean!):Boolean 
      removeTodo(id:ID!):Boolean 
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    todo: () => Todo.find(),
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({ text, complete: false });
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, complete }) => {
      await Todo.findByIdAndUpdate(id, { complete });
      return true;
    },
    removeTodo: async (_, { id, complete }) => {
        await Todo.findByIdAndRemove(id);
        return true;
      },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
