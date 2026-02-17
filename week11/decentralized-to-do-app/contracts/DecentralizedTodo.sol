// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DecentralizedTodo {

    // =========================
    // Custom Errors (Gas Efficient)
    // =========================
    error EmptyTitle();
    error TitleTooLong();
    error DescriptionTooLong();
    error InvalidTaskId();
    error TaskDoesNotExist();

    // =========================
    // Constants
    // =========================
    uint256 private constant MAX_TITLE_LENGTH = 100;
    uint256 private constant MAX_DESCRIPTION_LENGTH = 1000;

    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        uint256 timestamp;
        bool exists;
    }

    // user => taskId => Task
    mapping(address => mapping(uint256 => Task)) private tasks;

    // user => total created tasks (ID generator)
    mapping(address => uint256) private taskCounter;

    // user => active tasks count
    mapping(address => uint256) private activeTaskCount;

    // =========================
    // Events
    // =========================
    event TaskCreated(
        address indexed owner,
        uint256 indexed id,
        string title,
        string description,
        uint256 timestamp
    );

    event TaskToggled(
        address indexed owner,
        uint256 indexed id,
        bool completed
    );

    event TaskDeleted(
        address indexed owner,
        uint256 indexed id
    );

    // =========================
    // Create Task
    // =========================
    function createTask(
        string calldata _title,
        string calldata _description
    ) external {

        uint256 titleLength = bytes(_title).length;
        uint256 descriptionLength = bytes(_description).length;

        if (titleLength == 0) revert EmptyTitle();
        if (titleLength > MAX_TITLE_LENGTH) revert TitleTooLong();
        if (descriptionLength > MAX_DESCRIPTION_LENGTH) revert DescriptionTooLong();

        uint256 newId = ++taskCounter[msg.sender];

        tasks[msg.sender][newId] = Task({
            id: newId,
            title: _title,
            description: _description,
            completed: false,
            timestamp: block.timestamp,
            exists: true
        });

        activeTaskCount[msg.sender]++;

        emit TaskCreated(
            msg.sender,
            newId,
            _title,
            _description,
            block.timestamp
        );
    }

    // =========================
    // Toggle Task
    // =========================
    function toggleTask(uint256 _id) external {

        if (_id == 0 || _id > taskCounter[msg.sender])
            revert InvalidTaskId();

        Task storage task = tasks[msg.sender][_id];

        if (!task.exists)
            revert TaskDoesNotExist();

        task.completed = !task.completed;

        emit TaskToggled(msg.sender, _id, task.completed);
    }

    // =========================
    // Delete Task
    // =========================
    function deleteTask(uint256 _id) external {

        if (_id == 0 || _id > taskCounter[msg.sender])
            revert InvalidTaskId();

        Task storage task = tasks[msg.sender][_id];

        if (!task.exists)
            revert TaskDoesNotExist();

        task.exists = false;
        activeTaskCount[msg.sender]--;

        emit TaskDeleted(msg.sender, _id);
    }

    // =========================
    // Get Single Task
    // =========================
    function getTask(uint256 _id)
        external
        view
        returns (Task memory)
    {
        if (_id == 0 || _id > taskCounter[msg.sender])
            revert InvalidTaskId();

        Task memory task = tasks[msg.sender][_id];

        if (!task.exists)
            revert TaskDoesNotExist();

        return task;
    }

    // =========================
    // Get All Active Tasks
    // =========================
    function getAllTasks()
        external
        view
        returns (Task[] memory)
    {
        uint256 totalCreated = taskCounter[msg.sender];
        uint256 totalActive = activeTaskCount[msg.sender];

        Task[] memory userTasks = new Task[](totalActive);
        uint256 index;

        for (uint256 i = 1; i <= totalCreated; i++) {
            Task memory task = tasks[msg.sender][i];
            if (task.exists) {
                userTasks[index] = task;
                index++;
            }
        }

        return userTasks;
    }

    // =========================
    // Get Active Count
    // =========================
    function getTaskCount()
        external
        view
        returns (uint256)
    {
        return activeTaskCount[msg.sender];
    }
}
