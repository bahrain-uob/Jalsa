console.log("Hello  from votes page")


var Amplify = new AWS.Amplify();
console.log("Hello  from votes page")


const awsconfig = {
    "aws_project_region": "us-east-1",
    "aws_appsync_graphqlEndpoint": "https://ww5h7in3urf2fogejs7p7u43ye.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-ipacmzk3grdmzgkkss4r2u3pca",
};

Amplify.configure(awsconfig);

createVote()


function createVote(){

    const todo = { id: "My first vote from web", meeting_id: "Hello world!" , title:"Web", options:["Yes", "No"], votes:["Yes"] };

    Amplify.API.graphql(Amplify.graphqlOperation(createTodo, {input: todo}));


}


function updateVote(){

    const todo = { id: "My first vote from web", meeting_id: "Hello world!" , title:"Web", options:["Yes", "No"], votes:["Yes"] };

    Amplify.API.graphql(Amplify.graphqlOperation(updateTodo, {input: todo}));

}


function deleteVote(){

    const todo = { id: "My first vote from web"};

    Amplify.API.graphql(Amplify.graphqlOperation(deleteTodo, {input: todo}));


}

function listVotes(meeting_id){
    const todos =  Amplify.API.graphql(Amplify.graphqlOperation(queries.listTodos, {meeting_id: meeting_id}));

       console.log(todos)
}


function subscribe(){

    const subscription = Amplify.API.graphql(
        Amplify.graphqlOperation(subscriptions.onCreateTodo)
    ).subscribe({
        next: (todoData) => console.log(todoData)
    });

}
function subscribeUpdate(){

    const subscription = Amplify.API.graphql(
        Amplify. graphqlOperation(subscriptions.onUpdateTodo)
    ).subscribe({
        next: (todoData) => console.log(todoData)
    });

}


function subscribeDelete(){

    const subscription = Amplify.API.graphql(
        Amplify.graphqlOperation(subscriptions.onDeleteTodo)
    ).subscribe({
        next: (todoData) => console.log(todoData)
    });

}

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        meeting_id
        votes
        options
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
      id
      title
      meeting_id
      votes
      options
      createdAt
      updatedAt
    }
  }
`;