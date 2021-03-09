const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

const  { users, posts }  = require('./db')

const app = express()

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'User Posts',
    fields: () => ({
            userId:{ type: GraphQLNonNull(GraphQLInt) } ,
            id: { type: GraphQLNonNull(GraphQLInt) } ,
            title:{ type: GraphQLNonNull(GraphQLString) },
            body: { type: GraphQLNonNull(GraphQLString) }
        })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User info',
    fields: () => ({
            userId:{ type: GraphQLNonNull(GraphQLInt) } ,
            name:{ type: GraphQLNonNull(GraphQLString) },
            posts: {
                type: GraphQLList(PostType),
                description: 'List all user posts',
                resolve: (user) => {
                    return posts.filter(post => post.userId === user.userId)
                }
            }
        })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: {
        posts: {
         type: new GraphQLList(PostType),
         description: 'List of All Posts',
         resolve: () => posts   
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of All Users',
            resolve: () => users
        },
        post: {
            type: PostType,
            description: 'Single Post',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => posts.find(post => post.id === args.id)
        }
    }
})

const schema = new GraphQLSchema({
    query: RootQueryType
})


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))



app.listen(4000, () => console.log('Server is running.'))

