import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';

const API_URL = 'http://10.0.2.2/api.php'; // Altere para o IP do seu servidor

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Busca todas as tarefas
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas.');
    } finally {
      setIsLoading(false);
    }
  };

  // Adiciona uma nova tarefa
  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Erro', 'O título da tarefa não pode ser vazio.');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      const result = await response.json();
      if (result.task) {
        setTasks([...tasks, result.task]);
        setNewTaskTitle('');
      } else {
        Alert.alert('Erro', result.message || 'Erro ao adicionar a tarefa.');
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  };

  // Atualiza uma tarefa (toggle completed)
  const toggleTaskCompleted = async (taskId, currentStatus) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, completed: !currentStatus }),
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !currentStatus } : task
          )
        );
      } else {
        Alert.alert('Erro', result.message || 'Erro ao atualizar a tarefa.');
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
    }
  };

  // Deleta uma tarefa
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}?id=${taskId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        Alert.alert('Erro', result.message || 'Erro ao deletar a tarefa.');
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível deletar a tarefa.');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
  };

  const saveEditedTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Erro', 'O título da tarefa não pode ser vazio.');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingTask.id, title: newTaskTitle }),
      });
      const result = await response.json();
      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? { ...task, title: newTaskTitle } : task
          )
        );
        setNewTaskTitle('');
        setEditingTask(null);
      } else {
        Alert.alert('Erro', result.message || 'Erro ao salvar edição.');
      }
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      Alert.alert('Erro', 'Não foi possível salvar a edição.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity onPress={() => toggleTaskCompleted(item.id, item.completed)}>
        <Text
          style={[
            styles.taskTitle,
            item.completed && styles.taskCompleted,
          ]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => startEditing(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        {editingTask ? (
          <TouchableOpacity style={styles.saveButton} onPress={saveEditedTask}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  saveButton: {
    marginLeft: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#FFC107',
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
  },
});