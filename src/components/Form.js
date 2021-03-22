import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Must include email address"),
  motivation: yup.string().required("Must include why you'd like to join"),
  position: yup.string(),
  terms: yup.boolean().oneOf([true], "Please agree to terms of use")
});

export default function Form() {
  // managing state for our form inputs
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    motivation: "",
    position: "",
    terms: false
  });

  // BONUS!: state for whether our button should be disabled or not.
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // Everytime formState changes, check to see if it passes verification.
  // If it does, then enable the submit button, otherwise disable
  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const [errorState, setErrorState] = useState({
    name: "",
    email: "",
    motivation: "",
    position: "",
    terms: ""
  });

  const validate = e => {
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    yup
      .reach(formSchema, e.target.name)
      .validate(value)
      .then(valid => {
        setErrorState({
          ...errorState,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrorState({
          ...errorState,
          [e.target.name]: err.errors[0]
        });
      });
  };

  // onChange function
  const inputChange = e => {
    e.persist();
    // console.log("input changed!", e.target.value, e.target.checked);
    validate(e);
    let value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({ ...formState, [e.target.name]: value });
  };

  const formSubmit = e => {
    e.preventDefault();
    setFormState({name:"",email:"",motivation:"",position:""})
    console.log("form submitted!");
    axios
      .post("https://reqres.in/api/users", formState)
      .then(response => console.log(response))
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name
        <input
          type="text"
          name="name"
          id="name"
          value={formState.name}
          onChange={inputChange}
        />
        {errorState.name.length>0? <p className="error">{errorState.name}</p>:null}
      </label>
      <label htmlFor="email">
        Email
        <input
          type="email"
          name="email"
          id="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errorState.email.length > 0 ? (
          <p className="error">{errorState.email}</p>
        ) : null}
      </label>
      <label htmlFor="motivation">
        Why would you like to help?
        <textarea
          name="motivation"
          id="motivation"
          value={formState.motivation}
          onChange={inputChange}
        />
        {errorState.motivation.length > 0 ? (
          <p className="error">{errorState.motivation}</p>
        ) : null}
      </label>
      <label htmlFor="positions">
        What would you like to help with?
        <select
          value={formState.position}
          name="position"
          id="positions"
          onChange={inputChange}
        >
          <option value="Newsletter">Newsletter</option>
          <option value="Yard Work">Yard Work</option>
          <option value="Administrative Work">Administrative Work</option>
          <option value="Tabling">Tabling</option>
        </select>
        {errorState.position.length > 0 ? (
          <p className="error">{errorState.position}</p>
        ) : null}
      </label>
      <label htmlFor="terms">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms & Conditions
        {errorState.terms.length > 0 ? (
          <p className="error">{errorState.terms}</p>
        ) : null}
      </label>
      <button disabled={buttonDisabled}>Submit</button>
    </form>
  );
}
