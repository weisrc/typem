import { handler, setup } from "@typem/fetch-handler";
import { openapi } from "@typem/routes-openapi";
import type { FromJson, FromParam, FromQuery } from "typem";

type Person = {
  id: string;
  name: string;
  age: number;
};

const people: Person[] = [];

function addPerson(person: Omit<Person, "id"> & FromJson) {
  const id = Math.random().toString(36).slice(2);
  people.push({
    id,
    ...person,
  });
  return {
    message: "done",
    id,
  };
}

function listPeople(age?: string & FromQuery<"age">) {
  if (age) {
    return people.filter((p) => p.age === parseInt(age));
  }
  return people;
}

function getPerson(id: string & FromParam<"id">) {
  if (!id) {
    return people[0];
  }
  return people.find((p) => p.id === id);
}

setup();

const routes = openapi({
  "/people": {
    POST: handler(addPerson),
    GET: handler(listPeople),
  },
  "/people/:id": {
    GET: handler(getPerson),
  },
});

const server = Bun.serve({
  routes,
  port: 8080,
})

console.log(`listening on port ${server.port}`);