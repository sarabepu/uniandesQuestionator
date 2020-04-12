import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Footer from "./layout/Footer.js";
import Questions from "./components/Questions.js";
import FormCreateQuestion from "./components/FormCreateQuestion.js";
import Login from "./components/Login.js";
import Answers from "./components/Answers.js";
let initialQuestions = [
  // {
  //   question: "Dummy?",
  //   answers: [
  //     { answer: "I'm dummy", votes: 10 },
  //     { answer: "You're the dummy", votes: 2 },
  //   ],
  // },
  // {
  //   question: "Dummy Too?",
  //   answers: [
  //     { answer: "I'm dummy", votes: 10 },
  //     { answer: "You're the dummy", votes: 2 },
  //   ],
  // },
];

const App = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    fetch("/getUser")
      .then((res) => res.json())
      .then((user) => setUser(user));
  }, []);

  useEffect(() => {
    fetch("/getQuestions")
      .then((res) => res.json())
      .then((preg) => {
        initialQuestions = preg;
        return setQuestions(initialQuestions);
      });
  }, []);

  const onCreate = () => {
    alert("creating");
  };
  const onVote = (question, answer) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];

      const qObj = newQuestions.find((q) => q.question === question);
      const newAnswers = qObj.answers.map((a) =>
        a.answer === answer ? { answer: a.answer, votes: a.votes + 1 } : a
      );
      qObj.answers = newAnswers;
      fetch(`${qObj._id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qObj),
      });
      return newQuestions;
    });
  };

  const onLogout = () => {
    fetch("/logout")
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setUser(null);
        } else {
          alert("error");
        }
      });
  };

  const renderQuestions = (preguntas) => {};

  function Home() {
    return <h2>Home</h2>;
  }

  function About() {
    return <h2>About</h2>;
  }

  function CrearPregunta() {
    return (
      <div>
        <h2>Preguntar: </h2>
        <FormCreateQuestion user={user} onCreate={onCreate} />
      </div>
    );
  }

  function IniciarSesion() {
    return (
      <div>
        {!user ? (
          <Login />
        ) : (
          <div>
            Welcome! {user.username}
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    );
  }

  function Preguntas() {
    let match = useRouteMatch();

    return (
      <div>
        <h2>Preguntas</h2>
        <ul>
          <Questions
            user={user}
            questions={questions}
            onVote={onVote}
            match={match}
          />
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
          </li>
        </ul>

        {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
        <Switch>
          <Route path={`${match.path}/:id`}>
            <Pregunta />
          </Route>
          <Route path={match.path}>
            <h3>Please select a Pregunta.</h3>
          </Route>
        </Switch>
      </div>
    );
  }

  const findQuestion = (id) => {
    console.log("El id que estoy buscando es: ", id);
    questions.map((q) => {
      console.log("El id actual es: ", q._id);
      if (q._id === id) {
        console.log("Son iguales");
        console.log(q);
        setQuestion(q);
      }
    });
  };
  function Pregunta() {
    let { id } = useParams();
    findQuestion(id);
    console.log("Funciona coño", question);
    return (
      <div>
        <h3>Requested Pregunta ID: {id}</h3>
        {question ? (
          <Answers
            _id={question._id}
            user={user}
            answers={question.answers}
            question={question.question}
            onVote={onVote}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
  return (
    <div className="container">
      <h1>Questionator!!!</h1>
      <div className="row">
        <div className="col-8">
          <Router>
            <div>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/preguntas">Preguntas</Link>
                </li>
                <li>
                  <Link to="/crearPregunta">Preguntar</Link>
                </li>
                <li>
                  <Link to="/iniciarsesion">Iniciar Sesión</Link>
                </li>
              </ul>

              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/preguntas">
                  <Preguntas />
                </Route>
                <Route path="/crearPregunta">
                  <CrearPregunta />
                </Route>
                <Route path="/iniciarsesion">
                  <IniciarSesion />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
