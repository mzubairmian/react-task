import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // For expect(...).toBeInTheDocument()
import FactForm from "./FactForm"; // Assuming the path to your PersonForm component

test("renders form fields", () => {
  const { getByPlaceholderText, getByText } = render(<FactForm />);
  const titleInput = getByPlaceholderText("Enter title");
  const upvotesInput = getByPlaceholderText("Enter upvotes");
  const dateInput = getByPlaceholderText("Enter date");
  const submitButton = getByText("Submit");

  expect(titleInput).toBeInTheDocument();
  expect(upvotesInput).toBeInTheDocument();
  expect(dateInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test("submits form with valid data", () => {
  const handleSubmit = jest.fn();
  const { getByPlaceholderText, getByText } = render(<FactForm />);
  const title = getByPlaceholderText("Enter title");
  const upvotes = getByPlaceholderText("Enter upvotes");
  const date = getByPlaceholderText("Enter date");
  const submitButton = getByText("Add Data");

  fireEvent.change(title, { target: { value: "John Doe" } });
  fireEvent.change(upvotes, { target: { value: "30" } });
  fireEvent.change(date, { target: { value: "2024-04-13" } });
  fireEvent.click(submitButton);

  expect(handleSubmit).toHaveBeenCalledWith({
    title: "zubair",
    upvotes: "28",
    date: "2024-04-13",
  });
});
