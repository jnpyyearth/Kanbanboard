import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core'; //การตรวจสอบและอัปเดตค่า

@Component({
  selector: 'app-board',
  standalone: false,
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  inviteEmail: any;
  isInviteModalOpen: boolean | undefined;
  openaddpeopleModal(_t7: any) {
    throw new Error('Method not implemented.');
  }
  isBoardModalOpen: boolean = false;
  boards: any[] = [];
  columns: any[] = [];
  tasks: any[] = [];
  filteredBoards: { [key: number]: any[] } = {};
  newBoard = { name: '', date: '', stock: 0 };
  newColumn = { boardId: '', name: '' };
  newTask = { columnId: '', title: '', description: '', status: 'pending' };
  isEditBoardModalOpen: boolean = false;
  editedBoard: any = { id: null, name: '', date: '', stock: 0 };
  invitedFriend: string = '';
  isInvitePeopleModalOpen: boolean = false;
  selectedBoard: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getMockupData();
  }

  // เปิด Modal Add Board
  openaddboardModal() {
    console.log('Opening Board Modal');
    this.isBoardModalOpen = true;
  }

  // ปิด Modal Add Board
  closeaddboardModal() {
    console.log('Closing Board Modal');
    this.isBoardModalOpen = false;
  }

  // เพิ่ม Board ใหม่
  onAddboardSubmit() {
    console.log('Submitting Board:', this.newBoard);

    if (this.newBoard.name && this.newBoard.date && this.newBoard.stock > 0) {
      const newBoardData = {
        id: this.boards.length + 1,
        name: this.newBoard.name,
        date: this.newBoard.date,
        stock: this.newBoard.stock,
      };

      this.boards.push(newBoardData);
      localStorage.setItem('boards', JSON.stringify(this.boards));

      console.log('Board Added:', newBoardData);

      // รีเซ็ตค่า
      this.newBoard = { name: '', date: '', stock: 0 };
      this.closeaddboardModal();
    } else {
      console.error('Form is incomplete.');
    }
  }

  // ดึงข้อมูล Board จาก LocalStorage
  getMockupData() {
    let storedData = localStorage.getItem('boards');
    if (storedData) {
      this.boards = JSON.parse(storedData);
    } else {
      this.boards = [
        { id: 1, name: 'โปรเจค A', date: '2023-02-23', stock: 10 },
        { id: 2, name: 'โปรเจค B', date: '2023-02-24', stock: 5 },
        { id: 3, name: 'โปรเจค C', date: '2023-02-25', stock: 8 },
        { id: 4, name: 'โปรเจค X', date: '2023-02-26', stock: 12 },
      ];
      localStorage.setItem('boards', JSON.stringify(this.boards));
    }
  }

  // ลบ Board
  deleteBoard(boardId: number) {
    Swal.fire({
      title: 'ต้องการลบ Board หรือไม่?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.boards = this.boards.filter((board) => board.id !== boardId);
        localStorage.setItem('boards', JSON.stringify(this.boards));
        Swal.fire('ลบ Board แล้ว', '', 'success');
      }
    });
  }

  // กรอง Board
  filterBoards() {
    this.filteredBoards = {};
    this.boards.forEach((board) => {
      this.filteredBoards[board.id] = this.boards.filter(
        (task) => task.courseId === board.id
      );
    });
  }

  // เชื่อมต่อข้อมูล
  linkData() {
    this.boards.forEach((board) => {
      board['columns'] = this.columns
        .filter((column) => column.boardId === board.id)
        .map((column) => ({
          ...column,
          tasks: this.tasks.filter((task) => task.courseId === column.id),
        }));
    });
    console.log('Linked Data:', this.boards);
  }

  openEditBoardModal(board: any) {
    this.isEditBoardModalOpen = true;
    this.editedBoard = { ...board };
    this.cdr.detectChanges();
  }
  closeEditBoardModal() {
    this.isEditBoardModalOpen = false;
    this.editedBoard = { id: null, name: '', date: '', stock: 0 };
    this.cdr.detectChanges();
  }
  saveBoardEdit() {
    if (this.editedBoard.id !== null && this.editedBoard.name.trim() !== '') {
      let storedBoards = localStorage.getItem('boards');
      if (storedBoards) {
        this.boards = JSON.parse(storedBoards);
        let boardIndex = this.boards.findIndex(
          (b: any) => b.id === this.editedBoard.id
        );

        if (boardIndex !== -1) {
          this.boards[boardIndex] = { ...this.editedBoard };
          localStorage.setItem('boards', JSON.stringify(this.boards));
          this.getMockupData();
          this.closeEditBoardModal();
        }
      }
    }
  }

  openInviteModal(board: any) {
    this.isInviteModalOpen = true;
    this.selectedBoard = board;
  }

  // Close Invite Modal
  closeInviteModal() {
    this.isInviteModalOpen = false;
    this.inviteEmail = '';
    this.selectedBoard = null;
  }

  submitInvite() {
    if (!this.selectedBoard) {
      console.error('No board selected for invite.');
      return;
    }

    this.selectedBoard.invitedPeople = this.selectedBoard.invitedPeople
      ? [...this.selectedBoard.invitedPeople, this.invitedFriend]
      : [this.invitedFriend];

    let storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
      this.boards = JSON.parse(storedBoards);
      let boardIndex = this.boards.findIndex(
        (board) => board.id === this.selectedBoard.id
      );

      if (boardIndex !== -1) {
        this.boards[boardIndex] = { ...this.selectedBoard };
        localStorage.setItem('boards', JSON.stringify(this.boards));
      }
    }

    this.closeInviteModal();
  }

  onInviteSubmit() {
    if (!this.selectedBoard) {
      console.error('No board selected for invite.');
      return;
    }

    if (!this.inviteEmail.trim()) {
      Swal.fire('Error', 'Please enter a valid email.', 'error');
      return;
    }

    this.selectedBoard.invitedPeople = this.selectedBoard.invitedPeople
      ? [...this.selectedBoard.invitedPeople, this.inviteEmail]
      : [this.inviteEmail];

    let storedBoards = localStorage.getItem('boards');
    if (storedBoards) {
      this.boards = JSON.parse(storedBoards);
      let boardIndex = this.boards.findIndex(
        (board) => board.id === this.selectedBoard.id
      );

      if (boardIndex !== -1) {
        this.boards[boardIndex] = { ...this.selectedBoard };
        localStorage.setItem('boards', JSON.stringify(this.boards));
      }
    }

    Swal.fire('Success', 'Invitation sent successfully!', 'success');
    this.closeInviteModal();
  }
}
