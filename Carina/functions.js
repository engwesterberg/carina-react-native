import axios from 'axios';
import moment from 'moment';

const dbFormat = 'YYYY-MM-DD HH:mm:ss';

export const dbDate = (moment) => {
  if (process.env.NODE_ENV !== 'production') {
    return moment.format(dbFormat);
  }
  return moment.toISOString().slice(0, 19).replace('T', ' ');
};

export function replaceLast(find, replace, string) {
  var lastIndex = string.lastIndexOf(find);

  if (lastIndex === -1) {
    return string;
  }

  var beginString = string.substring(0, lastIndex);
  var endString = string.substring(lastIndex + find.length);

  return beginString + replace + endString;
}

export const signUp = async (userId, email, fullname, secret) => {
  let body = {
    user_id: null,
    email: email,
    fullname: fullname,
    secret: secret,
  };
  let results = await axios
    .post('http://192.168.0.100:5000/api/createuser', body)
    .then((res) => res.data)
    .catch((err) => console.error("Wasn't able to update property.", err));
  return results;
};

export const signIn = async (email, secret) => {
  let body = {
    email: email,
    secret: secret,
  };
  let results = await axios
    .post('http://192.168.0.100:5000/api/signin', body)
    .then((res) => res.data)
    .catch((err) => console.error("Wasn't able to update property.", err));
  return results;
};

export const addGoogleUser = async (googleId, email, name) => {
  let body = {
    id: googleId,
    email: email,
    name: name,
  };
  let results = await axios
    .post('http://192.168.0.100:5000/api/user', body)
    .then((res) => res.data)
    .catch((err) => console.error("Wasn't able to update property.", err));
  return results;
};

export const googleSignIn = async (google_id) => {
  let res = await axios
    .get(`http://192.168.0.100:5000/api/id/${google_id}`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
  return res[0].id;
};

export const getTodos = async (user_id) => {
  let results = await axios
    .get(`http://192.168.0.100:5000/api/todos/${user_id}`)
    .then((results) => results.data)
    .catch((error) => console.error(error));
  return results;
};

export const getLists = async (user_id) => {
  let results = await axios
    .get(`http://192.168.0.100:5000/api/list/${user_id}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const incPomo = async (user_id, todo_id) => {
  let results = await axios
    .put('http://192.168.0.100:5000/api/incpomo/', {
      user_id: user_id,
      todo_id: todo_id,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const newTodo = async (user_id, query, list_id) => {
  let results = await axios
    .post('http://192.168.0.100:5000/api/todo', {
      user_id: user_id,
      query: query,
      list_id: list_id,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const copyTodo = async (todo) => {
  let results = await axios
    .post('http://192.168.0.100:5000/api/todocopy', {
      user_id: todo.user_id,
      list_id: todo.list_id,
      title: todo.title,
      note: todo.note,
      due_date: todo.due_date,
      hasTime: todo.has_time,
      pomo_estimate: todo.pomo_estimate,
      recurring: todo.recurring,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const updateTodo = async (todo) => {
  let body = {
    id: todo.id,
    list_id: todo.list_id,
    title: todo.title,
    note: todo.note,
    pomo_estimate: todo.pomo_estimate,
    pomo_done: todo.pomo_done,
    state: todo.state,
    due_date:
      todo.due_date != null ? moment(todo.due_date).format(dbFormat) : null,
    has_time: todo.has_time,
    recurring: todo.recurring,
  };
  let results = await axios
    .put('http://192.168.0.100:5000/api/todo/', body)
    .then((res) => {
      return res.data;
    })
    .catch((e) => console.error(e));

  return results[0];
};

export const deleteTodo = async (todo_id) => {
  let results = await axios
    .delete(`http://192.168.0.100:5000/api/todo/${todo_id}`)
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const createList = async (user_id, listName) => {
  let results = await axios
    .post('http://192.168.0.100:5000/api/list/', {
      user_id: user_id,
      title: listName,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};
export const shareList = async (list_id, share_email, owner_id) => {
  let results = await axios
    .post('http://192.168.0.100:5000/api/shared_list/', {
      list_id: list_id,
      shared_with: share_email,
      owner_id: owner_id,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const deleteList = async (list_id) => {
  let results = axios
    .delete(`http://192.168.0.100:5000/api/list/${list_id}`)
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};
