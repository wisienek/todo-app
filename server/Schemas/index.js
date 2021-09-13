const graphql = require('graphql');
const { GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = graphql;

const TodoType = require('./TypeDefs/TodoType');

const prisma = require('../prisma/client');

const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllTodos: {
            type: new GraphQLList(TodoType),
            async resolve(parent, args) {
                return await prisma.todo.findMany();
            }
        },
        getTodo: {
            type: new GraphQLList(TodoType),
            args: { 
                id: { type: GraphQLInt },
                message: { type: GraphQLString },
                finished: { type: GraphQLBoolean }
            },
            async resolve(parent, args) {
                return await prisma.todo.findFirst({ 
                    where: {
                        id: args.id
                    }
                });
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
            async resolve(parent, args) {
                const newTodo = await prisma.todo.create({ data: {...args} });

                console.log(`New todo: `, newTodo);

                return newTodo;
            }
        },
        editTodoState: {
            type: TodoType,
            args: {
                id: { type: GraphQLInt },
                finished: { type: GraphQLBoolean }
            },
            async resolve(parent, args) {
                const searchedTodo = await prisma.todo.findFirst({ where: { id: args.id }});
                if( searchedTodo ) {
                    searchedTodo.finished = args.finished;

                    const update = await prisma.todo.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            finished: searchedTodo.finished
                        }
                    });
                    console.log(`update: `, update);

                    return searchedTodo;
                }

                return;
            }
        },
        removeTodo: {
            type: new GraphQLList(TodoType),
            args: {
                id: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                const deletedTodo = await prisma.todo.delete({
                    where: {
                        id: args.id
                    }
                });

                console.log(`Deleted: `, deletedTodo);

                return await prisma.todo.findMany();
            }
        }
    }
});

const schema = new GraphQLSchema({ query: rootQuery, mutation });


module.exports = schema;