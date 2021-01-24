import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const dbFormat = 'YYYY-MM-DD HH:mm:ss';
import {scheduleAll} from './NotificationHandler.js';
import {carinaParser} from './CarinaParser.js';
import NetInfo from '@react-native-community/netinfo';

//PROD -----------------------------------------------------------------------------
//const API_ADDRESS = 'http://139.162.196.99:5000';
//-----------------------------------------------------------------------------

//dev -----------------------------------------------------------------------------
const API_ADDRESS = 'http://172.16.11.253:5000';

const getRequestConfig = (token) => {
  return {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
};

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getDaysSince = (date) => {
  let dayDiff = moment().diff(date, 'days');
  switch (dayDiff) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    default:
      return `${dayDiff} days ago`;
  }
};

export const checkInternetConnection = async () => {
  let connection = await NetInfo.fetch();
  console.log('isconnted: ', connection.isConnected);
  return connection.isConnected;
};

export const dbDate = (date) => {
  if (process.env.NODE_ENV !== 'production') {
    return date.format(dbFormat);
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
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

export const storageHelper = {
  set: async (key, value) => {
    console.log('set');
    try {
      return await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  },
  get: async (key) => {
    console.log('get');
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error(e);
    }
  },
  remove: (key) => {
    console.log('remove');
    try {
      AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  },
};

export const localDataHandler = {
  getTodos: async () => {
    let offlineTodos = await storageHelper.get('offlineTodos');
    let obj = JSON.parse(offlineTodos);
    let todos = obj.data;
    return todos;
  },
  getLists: async () => {
    let offlineLists = await storageHelper.get('offlineLists');
    let obj = JSON.parse(offlineLists);
    let lists = obj.data;
    return lists;
  },
};
// --------------------------- Database Functions ------------------------------------------
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
    .catch((err) => {
      throw err;
    });
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
      return res;
    })
    .catch((err) => console.error(err));
  return res.data;
};

export const getTodos = async (getDone, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/todos/${getDone}`, getRequestConfig(token))
    .then((results) => {
      let todos = results.data[0];

      let jsonString = JSON.stringify({data: todos});
      storageHelper.set('offlineTodos', jsonString);
      scheduleAll(todos);
      return todos;
    })
    .catch((error) => {
      throw error;
    });
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

export const getLists = async (token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/list/`, getRequestConfig(token))
    .then((res) => {
      let lists = res.data[0];
      let jsonString = JSON.stringify({data: lists});
      storageHelper.set('offlineLists', jsonString);
      return lists;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });

  return results;
};

export const incPomo = async (todo_id, token) => {
  let results = await axios
    .put(
      `${API_ADDRESS}/api/incpomo/`,
      {
        todo_id: todo_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const getPomosToday = async (token) => {
  let results = await axios
    .put(`${API_ADDRESS}/api/pomotoday/`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => console.error(e));

  return results[0];
};

export const addTodo = async (query, list_id, token) => {
  let parsed = carinaParser(query);
  console.log('bajs: ', parsed);
  let results = await axios
    .post(
      `${API_ADDRESS}/api/todo`,
      {
        list_id: list_id,
        title: parsed.newQuery,
        note: null,
        due_date: parsed.due_date ? parsed.due_date : null,
        has_time: parsed.has_time,
        pomo_estimate: parsed.pomo_estimate,
        recurring: parsed.recurring,
      },
      getRequestConfig(token),
    )
    .then((res) => {
      let todo = res.data[0][0];

      return todo;
    })
    .catch((err) => {
      throw err;
    });
  return results;
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
    .catch((err) => {
      console.error(err);
      throw err;
    });
  return results[0];
};

export const deleteSubTask = async (id, token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/subtask/${id}`, getRequestConfig(token))
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });
  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });
  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });
  return results;
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
      return res.data[0];
    })
    .catch((e) => {
      throw e;
    });

  return results;
};

export const deleteTodo = async (todo_id, token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/todo/${todo_id}`, getRequestConfig(token))
    .then((res) => res.data[0])
    .catch((e) => {
      console.error(e);
      throw e;
    });

  return results;
};

export const emptyTrash = async (token) => {
  let results = await axios
    .delete(`${API_ADDRESS}/api/emptytrash/`, getRequestConfig(token))
    .then((res) => res.data[0])
    .catch((e) => {
      console.error(e);
      throw e;
    });

  return results;
};

export const createList = async (listName, token) => {
  let results = await axios
    .post(
      `${API_ADDRESS}/api/list/`,
      {
        title: listName,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data[0][0])
    .catch((e) => {
      throw e;
    });
  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });
  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });
  return results;
};

export const getSharedWith = async (list_id, token) => {
  let results = await axios
    .get(`${API_ADDRESS}/api/sharedwith/${list_id}`, getRequestConfig(token))
    .then((res) => res.data)
    .catch((e) => {
      console.error(e);
      throw e;
    });

  return results[0];
};

export const updateList = async (list_id, title, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/list/`,
      {
        list_id: list_id,
        title: title,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};

export const deleteList = async (list_id, token) => {
  let results = axios
    .delete(`${API_ADDRESS}/api/list/${list_id}`, getRequestConfig(token))
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};

export const completeTodo = async (todo_id, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/completetodo/`,
      {
        todo_id: todo_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
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
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};

export const updateTodosList = async (todo_id, list_id, token) => {
  let results = axios
    .put(
      `${API_ADDRESS}/api/todoslist/`,
      {
        todo_id: todo_id,
        list_id: list_id,
      },
      getRequestConfig(token),
    )
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};

export const beginResetPassword = async (email) => {
  let results = axios
    .post(`${API_ADDRESS}/api/beginresetpassword/`, {
      email: email,
    })
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};

export const confirmResetPassword = async (
  email,
  new_password,
  confirmation_code,
) => {
  let results = axios
    .put(`${API_ADDRESS}/api/confirmresetpassword/`, {
      email: email,
      new_password: new_password,
      confirmation_code: confirmation_code,
    })
    .then((res) => res.data[0])
    .catch((e) => {
      throw e;
    });

  return results;
};
