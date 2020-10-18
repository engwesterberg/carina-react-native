import axios from 'axios';
import moment from 'moment';

const dbFormat = 'YYYY-MM-DD HH:mm:ss';

const getRequestConfig = (token) => {
  return {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
};
const API_ADDRESS = 'http://172.16.11.253:5000';
//const API_ADDRESS = 'http://139.162.196.99:5000';

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
    .post(`${API_ADDRESS}/api/createuser`, body)
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
    .post(`${API_ADDRESS}/api/signin`, body)
    .then((res) => {
      console.log('userinfo: ', res.data.userInfo);
      console.log('token: ', res.data.token);
      return res.data;
    })
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
    .post(`${API_ADDRESS}/api/user`, body)
    .then((res) => res.data)
    .catch((err) => console.error("Wasn't able to update property.", err));
  return results;
};

export const getUserIdByGoogleId = async (google_id) => {
  let res = await axios
    .get(`${API_ADDRESS}/api/id/${google_id}`)
    .then((res) => {
      console.log('getgoogleuser: ', res.data);
      return res;
    })
    .catch((err) => console.error(err));
  return res.data;
};

export const getTodos = async (user_id, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/todos/${user_id}`, getRequestConfig(token))
    .then((results) => results.data)
    .catch((error) => console.error(error));
  return results;
};

export const getSubTasks = async (todo_id, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/subtask/${todo_id}`, getRequestConfig(token))
    .then((results) => {
      return results.data[0];
    })
    .catch((error) => console.error(error));
  return results;
};

export const getLists = async (user_id, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/list/${user_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const incPomo = async (user_id, todo_id) => {
  let results = await axios
    .put(`${API_ADDRESS}/api/incpomo/`, {
      user_id: user_id,
      todo_id: todo_id,
    })
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const getPomosToday = async (user_id) => {
  let results = await axios
    .put(`${API_ADDRESS}/api/pomotoday/${user_id}`)
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const addTodo = async (user_id, query, list_id, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/todo`,
      {
        user_id: user_id,
        query: query,
        list_id: list_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const addSubTask = async (todo_id, title, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/subtask`,
      {
        todo_id: todo_id,
        title: title,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const deleteSubTask = async (id, token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/subtask/${id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const editSubTask = async (subtask_id, title, state, token) => {
  let results = await axios
    .put(
      `${API_ADDRESS}/api/subtask`,
      {
        subtask_id: subtask_id,
        title: title,
        state: state,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const copyTodo = async (todo, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/todocopy`,
      {
        user_id: todo.user_id,
        list_id: todo.list_id,
        title: todo.title,
        note: todo.note,
        due_date: todo.due_date,
        hasTime: todo.has_time,
        pomo_estimate: todo.pomo_estimate,
        recurring: todo.recurring,
      },
      getRequestConfig(token),
    )
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
    .put(`${API_ADDRESS}/api/todo/`, body)
    .then((res) => {
      return res.data;
    })
    .catch((e) => console.error(e));

  return results[0];
};

export const deleteTodo = async (todo_id, token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/todo/${todo_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const emptyTrash = async (user_id, token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/emptytrash/${user_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const createList = async (user_id, listName, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/list/`,
      {
        user_id: user_id,
        title: listName,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const shareList = async (list_id, share_email, owner_id, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/shared_list/`,
      {
        list_id: list_id,
        shared_with: share_email,
        owner_id: owner_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const stopSharingList = async (list_id, shared_with, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/stopsharinglist/`,
      {
        list_id: list_id,
        shared_with: shared_with,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));
  return results[0];
};

export const getSharedWith = async (list_id, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/sharedwith/${list_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
    });

  return results[0];
};

export const updateList = async (list_id, title, token) => {
  let results = axios
    .put(
      'http://172.16.11.253:5000/api/list/',
      {
        list_id: list_id,
        title: title,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const deleteList = async (list_id, token) => {
  let results = axios
    .delete(`${API_ADDRESS}/api/list/${list_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

//Update todos
export const updateTodoState = async (todo_id, newState, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todostate/`,
      {
        todo_id: todo_id,
        state: newState,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodoTitle = async (todo_id, newTitle, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todotitle/`,
      {
        todo_id: todo_id,
        newTitle: newTitle,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodoNote = async (todo_id, newNote, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todonote/`,
      {
        todo_id: todo_id,
        newNote: newNote,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updatePomoEstimate = async (todo_id, newPomoEstimate, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todopomoestimate/`,
      {
        todo_id: todo_id,
        newPomoEstimate: newPomoEstimate,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodoDate = async (todo_id, newDate, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/tododate/`,
      {
        todo_id: todo_id,
        newDate: newDate,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodoTime = async (todo_id, newTime, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todotime/`,
      {
        todo_id: todo_id,
        newTime: newTime,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodoRecurring = async (todo_id, newRecurring, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todorecurring/`,
      {
        todo_id: todo_id,
        newRecurring: newRecurring,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const updateTodosList = async (todo_id, list_id, token) => {
console.log(todo_id, list_id);
  let results = axios
    .put(
      `${API_ADDRESS}/api/todoslist/`,
      {
        todo_id: todo_id,
        list_id: list_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};
