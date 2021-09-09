const graphql = require('graphql');
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean } = graphql;

const TodoType = new GraphQLObjectType({
    name: "Todo",
    fields: () => ({
        id: { type: GraphQLInt },
        message: { type: GraphQLString },
        finished: { type: GraphQLBoolean }
    })
});

module.exports = TodoType;