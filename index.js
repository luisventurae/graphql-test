const express = require('express')
const app = express()
const PORT = 1234

const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

// Datos Simulados
const { courses } = require('./data/course.json')

// Se construye el esquema de cómo van a lucir los datos
// Se construye la query y las consultas
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(author: String): [Course]
    }
    type Mutation {
        updateCourseTitle(id: Int!, title: String!): Course
    }

    type Course {
        id: Int
        title: String
        author: String
        url: String
        addedAt: String
    }
`)

// Se definen Funciones
const getCourse = (args) => {
    let id = args.id
    console.log('id',id)
    return courses.find(course => course.id === id)
}
const getCourses = (args) => {
    if( args.author ) {
        const author = args.author
        console.log('author',author)
        return courses.filter(course => course.author === author)
    }
}
const updateCourseTitle = ({id, title}) => {
    courses.map(course => {
        if( course.id === id ) {
            course.title = title
            return course
        }
    })
    return courses.find(course => course.id === id)
}

// Se definen los métodos que se utilizaran para llamar desde el app-client
const root = {
    message: () => 'Hola Mundo',
    course: getCourse,
    courses: getCourses,
    updateCourseTitle: updateCourseTitle,
}

// Se define un endpoint para realizar consultas graphql
app.use('/graphql', graphqlHTTP({
    schema: schema, // Construye el esquema
    rootValue: root, 
    graphiql: true, // Para ver la interfaz 
}))

app.listen(PORT, () => {
    console.log('\x1b[34m%s \x1b[36m%s \x1b[0m', `Running on `, `http://localhost:${PORT}/graphql`)
})