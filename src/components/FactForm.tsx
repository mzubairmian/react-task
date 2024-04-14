import React, { useEffect, useState } from "react";
import { Button, Form, Header } from "semantic-ui-react";
import { useAppContext } from "../AppContext";
import { toast } from "react-toastify";

const FactForm: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [factData, setFactData] = useState({
    id: state.editingFact ? state.editingFact.id : 0,
    title: "",
    upvotes: "",
    date: "",
  });

  useEffect(() => {
    if (state.editingFact) {
      setFactData({
        ...state.editingFact,
        upvotes: state.editingFact.upvotes.toString(),
      });
    }
  }, [state.editingFact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFactData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, upvotes, date } = factData;
    if (title && upvotes && date) {
      const newFact = {
        id: Date.now(),
        title,
        upvotes: parseInt(upvotes),
        date,
      };
      if (state.editingFact) {
        dispatch({
          type: "UPDATE_FACT",
          payload: { ...newFact, id: factData.id },
        });
        toast.success("Record edited successfully!");
      } else {
        dispatch({ type: "ADD_FACT", payload: newFact });
        toast.success("Record added successfully!");
      }

      setFactData({ id: 0, title: "", upvotes: "", date: "" });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="fact-form">
      <Header as="h4">
        {" "}
        {state.editingFact ? "Edit Record" : "Add Record"}
      </Header>
      <Form.Input
        label="Title"
        placeholder="Enter title"
        name="title"
        value={factData.title}
        onChange={handleChange}
      />
      <Form.Input
        label="Age"
        placeholder="Enter upvotes"
        name="upvotes"
        value={factData.upvotes}
        onChange={handleChange}
      />
      <Form.Input
        label="Date "
        placeholder="Enter date"
        name="date"
        type="date"
        value={factData.date}
        onChange={handleChange}
      />
      <Button primary type="submit">
        {state.editingFact ? "Save Edits" : "Add Date"}
      </Button>
    </Form>
  );
};

export default FactForm;
