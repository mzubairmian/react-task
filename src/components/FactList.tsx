import React, { useEffect, useState } from "react";
import {
  Button,
  Confirm,
  Header,
  Input,
  List,
  Modal,
  Table,
} from "semantic-ui-react";
import { useAppContext, Fact, getAllFactsFromDB } from "../AppContext";
import { toast } from "react-toastify";

const FactList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleView = (fact: Fact) => {
    setSelectedFact(fact);
    setModalOpen(true);
  };

  const handleEdit = (fact: Fact) => {
    setEditingId(fact.id);
    dispatch({ type: "SET_EDITING_FACT", payload: fact });
  };

  const handleDelete = (fact: Fact) => {
    setSelectedFact(fact);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch({ type: "DELETE_FACT", payload: selectedFact?.id ?? 0 });
    setConfirmOpen(false);
    toast.success("Record deleted successfully!");
  };
  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setSearchQuery(value);

    if (value.length >= 3) {
      const filteredFacts = state.facts.filter((fact) =>
        fact.title.toLowerCase().includes(value.toLowerCase())
      );
      dispatch({ type: "SET_FACTS", payload: filteredFacts });
    } else if (value === "") {
      console.log("state.facts", state.facts);
      dispatch({ type: "SET_FACTS", payload: state.facts });
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      fetchDataFromIndexedDB();
    }
  }, [searchQuery]);

  const fetchDataFromIndexedDB = async () => {
    try {
      const factsFromDB = await getAllFactsFromDB();
      dispatch({ type: "SET_FACTS", payload: factsFromDB });
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
    }
  };

  const handleSortByUpVotes = (): void => {
    const sorted = [...state.facts].sort((a, b) => b.upvotes - a.upvotes);
    dispatch({ type: "SET_FACTS", payload: sorted });
  };

  const handleSortByMostRecent = (): void => {
    const sorted = [...state.facts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    dispatch({ type: "SET_FACTS", payload: sorted });
  };

  return (
    <>
      <div className="list-header">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="sort-buttons">
          <span>SORT BY</span>
          <Button className="sort-button" onClick={handleSortByUpVotes}>
            Most Upvoted
          </Button>
          <Button className="sort-button" onClick={handleSortByMostRecent}>
            Most Recent
          </Button>
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={7}>Title</Table.HeaderCell>
            <Table.HeaderCell>Upvotes</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {state.facts.map((fact) => (
            <Table.Row key={fact.id}>
              <Table.Cell>{fact.title}</Table.Cell>
              <Table.Cell>{fact.upvotes}</Table.Cell>
              <Table.Cell>{fact.date}</Table.Cell>
              <Table.Cell>
                <Button
                  className="row-view-button"
                  onClick={() => handleView(fact)}
                >
                  View
                </Button>
                <Button primary onClick={() => handleEdit(fact)}>
                  Edit
                </Button>
                <Button negative onClick={() => handleDelete(fact)}>
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Record Details</Modal.Header>
        <Modal.Content>
          {selectedFact && (
            <Modal.Description>
              <Header>{selectedFact.title}</Header>
              <List>
                <List.Item>Age: {selectedFact.upvotes}</List.Item>
                <List.Item>Date of Birth: {selectedFact.date}</List.Item>
              </List>
            </Modal.Description>
          )}
        </Modal.Content>
      </Modal>
      <Confirm
        open={confirmOpen}
        header="Confirm Delete"
        content={`Are you sure you want to delete ${selectedFact?.title}?`}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default FactList;
