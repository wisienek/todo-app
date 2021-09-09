const graphql = require('graphql');
const { GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = graphql;

const TodoType = require('./TypeDefs/TodoType');

const TodosData = require('./data.json');

const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllTodos: {
            type: new GraphQLList(TodoType),
            resolve(parent, args) {
                return TodosData;
            }
        },
        getTodo: {
            type: new GraphQLList(TodoType),
            args: { 
                id: { type: GraphQLInt },
                message: { type: GraphQLString },
                finished: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                return TodosData.filter(todo=> todo.finished == args.finished);
            }
        }

    }
});
const mutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        createTodo: {
            type: TodoType,
            args: {
                message: { type: GraphQLString },
                finished: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                let newTodo = { ...args, id: TodosData.length+1 };
                TodosData.push(newTodo);
                return newTodo;
            }
        }
    }
});

const schema = new GraphQLSchema({ query: rootQuery, mutation });


module.exports = schema;