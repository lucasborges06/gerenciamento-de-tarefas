<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite requisições de qualquer origem
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$tasksFile = 'tasks.json';

// Função para ler as tarefas do arquivo JSON
function getTasks() {
    global $tasksFile;
    if (!file_exists($tasksFile)) {
        file_put_contents($tasksFile, '[]');
    }
    return json_decode(file_get_contents($tasksFile), true);
}

// Função para salvar as tarefas no arquivo JSON
function saveTasks($tasks) {
    global $tasksFile;
    file_put_contents($tasksFile, json_encode($tasks, JSON_PRETTY_PRINT));
}

$method = $_SERVER['REQUEST_METHOD'];
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Lida com as requisições
switch ($method) {
    case 'GET':
        // Lista todas as tarefas
        $tasks = getTasks();
        echo json_encode($tasks);
        break;

    case 'POST':
        // Adiciona uma nova tarefa
        $tasks = getTasks();
        $newTask = [
            'id' => uniqid(), // Gera um ID único
            'title' => $data['title'],
            'completed' => false
        ];
        $tasks[] = $newTask;
        saveTasks($tasks);
        echo json_encode(['message' => 'Tarefa adicionada com sucesso!', 'task' => $newTask]);
        break;

    case 'PUT':
        // Atualiza uma tarefa existente
        $tasks = getTasks();
        $taskId = $data['id'];
        $found = false;
        foreach ($tasks as &$task) {
            if ($task['id'] == $taskId) {
                $task['title'] = $data['title'] ?? $task['title'];
                $task['completed'] = $data['completed'] ?? $task['completed'];
                $found = true;
                break;
            }
        }
        saveTasks($tasks);
        if ($found) {
            echo json_encode(['message' => 'Tarefa atualizada com sucesso!']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Tarefa não encontrada.']);
        }
        break;

    case 'DELETE':
        // Deleta uma tarefa
        $tasks = getTasks();
        $taskId = $_GET['id'] ?? null;
        if ($taskId) {
            $tasks = array_filter($tasks, function($task) use ($taskId) {
                return $task['id'] != $taskId;
            });
            saveTasks(array_values($tasks)); // Reindexa o array
            echo json_encode(['message' => 'Tarefa deletada com sucesso!']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID da tarefa não fornecido.']);
        }
        break;
    
    case 'OPTIONS':
        http_response_code(200);
        exit();

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método não permitido.']);
        break;
}
?>