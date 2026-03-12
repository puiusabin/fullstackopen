const Header = ({ course }) => {
  return (
    <>
      <h1>{course}</h1>
    </>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <>
      <p>
        {name} {exercises}
      </p>
    </>
  );
};

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

const Total = ({ parts }) => {
  return (
    <>
      <h4>
        Number of exercises{" "}
        {parts.reduce((sum, part) => sum + part.exercises, 0)}
      </h4>
    </>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}></Content>
      <Total parts={course.parts} />
    </div>
  );
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];
  return (
    <div>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

export default App;
