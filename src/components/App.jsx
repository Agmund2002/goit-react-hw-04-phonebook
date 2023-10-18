import { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { MainTitle, Message, SecondaryTitle } from './individualElements/Title.styled';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    if (contacts !== null) {
      this.setState({
        contacts: JSON.parse(contacts),
      });
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addContact = contact => {
    if (this.state.contacts.find(({ name }) => name === contact.name)) {
      return Notify.failure(`${contact.name} is already in contacts`);
    }

    this.setState(({ contacts }) => {
      return {
        contacts: [...contacts, { id: nanoid(), ...contact }],
      };
    });
  };

  deleteContact = key => {
    this.setState(({ contacts }) => {
      return {
        contacts: contacts.filter(({ id }) => id !== key),
      };
    });
  };

  changeFilter = newFilter => {
    this.setState({ filter: newFilter });
  };

  render() {
    const { contacts, filter } = this.state;

    const filterArray = contacts.filter(({ name }) => {
      if (filter === '') {
        return true;
      }

      return name.toLowerCase().includes(filter.toLowerCase());
    });

    return (
      <div>
        <MainTitle>Phonebook</MainTitle>
        <ContactForm onAdd={this.addContact} />
        <SecondaryTitle>Contacts</SecondaryTitle>
        <Filter filter={filter} onChange={this.changeFilter} />
        {this.state.contacts.length > 0 ? (
          <ContactList arr={filterArray} onDelete={this.deleteContact} />
        ) : (
          <Message>Phonebook is empty</Message>
        )}
      </div>
    );
  }
}
