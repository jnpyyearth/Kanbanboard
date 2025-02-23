import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  newColumnName: string = '';
  filteredTasks: { [key: number]: any[] } = {};
  isColumnModalOpen: boolean = false;
  isTaskModalOpen: boolean = false;
  selectedColumnId: number | null = null;
  selectedTaskId: number | null = null;
  selectedBoardId: number | null = null;
  selectedColumnName: string = '';
  draggedTask: any = null;
  tasks: any[] = [];
  columns: any[] = [];
  filteredColumns: any[] = [];
  newTask = { name: '', description: '', people: '', status: 'todo', courseId: null as number | null };
  boardId: number | null = null; 
  boards: any[] = [];
  isEditColumnModalOpen: boolean = false;
  editedColumnId: number | null = null;
  editedColumnName: string = '';
  isEditTaskModalOpen: boolean = false;
  editedTask: any = { id: null, name: '', description: '', people: '', status: 'pending', courseId: null };
  isInviteModalOpen: boolean = false;
  invitedFriend: string = '';
  draggedColumnId: number | null = null;
  draggedTaskIndex: number | null = null;
  
  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.boardId = params['boardId'] ? Number(params['boardId']) : null;
      console.log("Selected Board ID:", this.boardId);

      this.getBoardsData();
      this.filterTasksByColumn();
    });
  }

  // แสดงข้อมูล Board และ Columns เฉพาะของ Board ที่เลือก
  getBoardsData() {
    let storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
      this.boards = JSON.parse(storedBoards);
      let currentBoard = this.boards.find(board => board.id === this.boardId);
      this.columns = currentBoard ? currentBoard.columns || [] : [];
    } else {
      this.boards = [];
      this.columns = [];
    }

    console.log("Loaded Columns for Board ID:", this.boardId, this.columns);
  }

  // เปิด/ปิด Modal Column
  openaddcolumnModal() {
    this.isColumnModalOpen = true;
    this.cdr.detectChanges();
  }
  closeaddcolumnModal() {
    this.isColumnModalOpen = false;
    this.cdr.detectChanges();
  }

  // ฟิลเตอร์ Tasks ให้เฉพาะ Board และ Column ที่เกี่ยวข้อง
  filterTasksByColumn() {
    this.filteredTasks = {};
    let storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.columns.forEach(column => {
        this.filteredTasks[column.id] = this.tasks.filter(task => 
          task.courseId === column.id && task.boardId === this.boardId
        );
      });
    }

    console.log("Filtered Tasks:", this.filteredTasks);
  }


  // เพิ่มColumnใน Board ที่เลือก
  submitColumnForm() {
    if (this.newColumnName && this.boardId !== null) {
      let storedBoards = localStorage.getItem('boards');
      if (storedBoards) {
        this.boards = JSON.parse(storedBoards);
        let boardIndex = this.boards.findIndex(board => board.id === this.boardId);

        if (boardIndex !== -1) {
          const newColumn = { 
            id: Date.now(),
            name: this.newColumnName,
            boardId: this.boardId
          };

          if (!this.boards[boardIndex].columns) {
            this.boards[boardIndex].columns = [];
          }
          this.boards[boardIndex].columns.push(newColumn);

          localStorage.setItem('boards', JSON.stringify(this.boards));

          this.getBoardsData();
          this.newColumnName = '';
          this.closeaddcolumnModal();
        }
      }
    } else {
      console.error("Column Name is empty or Board ID is missing.");
    }
  }

  // ลบColumn
  deleteColumn(columnId: number) {
    let storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
      this.boards = JSON.parse(storedBoards);
      let boardIndex = this.boards.findIndex(board => board.id === this.boardId);

      if (boardIndex !== -1) {
        this.boards[boardIndex].columns = this.boards[boardIndex].columns.filter((col: { id: number; }) => col.id !== columnId);
        localStorage.setItem('boards', JSON.stringify(this.boards));
        this.getBoardsData();
      }
    }
  }

  // เปิด/ปิด Modal Task
  openaddTaskModal(columnId: number) {
    this.isTaskModalOpen = true;
    this.selectedColumnId = columnId;
  }
  closeaddTaskModal() {
    this.isTaskModalOpen = false;
    this.selectedColumnId = null;
  }


  submitTaskForm() {
    if (this.newTask.name && this.selectedColumnId !== null) {
      let newTask = { 
        id: Date.now(), 
        ...this.newTask,  // ใช้ Spread Operator เพื่อดึงข้อมูล newTask ทั้งหมด
        courseId: this.selectedColumnId, 
        boardId: this.boardId 
      };
  
      let storedTasks = localStorage.getItem('tasks');
      this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
  
      this.tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
  
      this.filterTasksByColumn();
      this.newTask = { name: '', description: '', people: '', status: 'todo', courseId: null };
      this.closeaddTaskModal();
    }
  }


  // ลบและอัปเดต LocalStorage
  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.filterTasksByColumn();
  }

  // ลากTaskางในColumnอื่นได้
  onDragStart(event: DragEvent, task: any) {
    this.draggedTask = JSON.parse(JSON.stringify(task));
  }

  


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, newColumnId: number) {
    event.preventDefault();

    if (this.draggedTask) {
      this.tasks = this.tasks.map(task => 
        task.id === this.draggedTask.id ? { ...task, courseId: newColumnId } : task
      );

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.filterTasksByColumn();
      this.draggedTask = null;
    }
  }

 editcolumn(columnId: number) {

  let storedBoards = localStorage.getItem('boards');
  if (storedBoards) {
    this.boards = JSON.parse(storedBoards);
    let boardIndex = this.boards.findIndex(board => board.id === this.boardId);

    if (boardIndex !== -1) {
      this.boards[boardIndex].columns = this.boards[boardIndex].columns.filter((col: { id: number; }) => col.id !== columnId);
      localStorage.setItem('boards', JSON.stringify(this.boards));
      this.getBoardsData();
    }
  }

 }

 openEditColumnModal(column: any) {
  this.isEditColumnModalOpen = true;
  this.editedColumnId = column.id;
  this.editedColumnName = column.name;
}

closeEditColumnModal() {
  this.isEditColumnModalOpen = false;
  this.editedColumnId = null;
  this.editedColumnName = '';
}

saveColumnEdit() {
  if (this.editedColumnId !== null && this.editedColumnName.trim() !== '') {
    let storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
      this.boards = JSON.parse(storedBoards);
      let boardIndex = this.boards.findIndex(board => board.id === this.boardId);

      if (boardIndex !== -1) {
        let columnIndex = this.boards[boardIndex].columns.findIndex((col: { id: number; }) => col.id === this.editedColumnId);
        if (columnIndex !== -1) {
          this.boards[boardIndex].columns[columnIndex].name = this.editedColumnName;
          localStorage.setItem('boards', JSON.stringify(this.boards));
          this.getBoardsData();
          this.closeEditColumnModal();
        }
      }
    }
  }
}

openEditTaskModal(task: any) {
  this.isEditTaskModalOpen = true;
  this.editedTask = { ...task }; //Task ที่แก้
  this.cdr.detectChanges();
}
closeEdittaskModal() {
  this.isEditTaskModalOpen = false;
  this.editedTask = { id: null, name: '', description: '', people: '', status: 'todo' };
  this.cdr.detectChanges();
}

saveTaskEdit() {
  if (this.editedTask.id !== null) {
    let storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      let taskIndex = this.tasks.findIndex(task => task.id === this.editedTask.id);
      
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.editedTask };
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.filterTasksByColumn();
        this.closeEdittaskModal();
      }
    }
  }
}






}
