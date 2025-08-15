"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
class Person {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    getDetails() {
        console.log(`ID:${this.id}-Name:${this.name}-Email:${this.email}-Phone:${this.phone}`);
    }
    getId() {
        return this.id;
    }
}
class Book {
    constructor(bookId, title, price, amount, type) {
        this.bookId = bookId;
        this.title = title;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.isAvailable = amount > 0;
    }
    borrowBook() {
        if (this.amount > 0) {
            this.amount -= 1;
            this.isAvailable = this.amount > 0;
        }
    }
    returnBook() {
        this.amount += 1;
        this.isAvailable = true;
    }
    getBookId() {
        return this.bookId;
    }
    getTitle() {
        return this.title;
    }
    getType() {
        return this.type;
    }
    isBookAvailable() {
        return this.isAvailable;
    }
    getPrice() {
        return this.price;
    }
}
class FictionBook extends Book {
    constructor(bookId, title, price, amount) {
        super(bookId, title, price, amount, "Tieu thuyet");
    }
    calculateLateFee(daysLate) {
        return daysLate * 5000;
    }
}
class ScienceBook extends Book {
    constructor(bookId, title, price, amount) {
        super(bookId, title, price, amount, "Khoa hoc");
    }
    calculateLateFee(daysLate) {
        return daysLate * 10000;
    }
}
class HistoryBook extends Book {
    constructor(bookId, title, price, amount) {
        super(bookId, title, price, amount, "Lich su");
    }
    calculateLateFee(daysLate) {
        return daysLate * 7000;
    }
}
class Borrowing {
    constructor(transactionId, borrower, book, days) {
        this.transactionId = transactionId;
        this.borrower = borrower;
        this.book = book;
        this.days = days;
        this.totalCost = book.getPrice() + book.calculateLateFee(Math.max(0, days - 7));
    }
    getDetails() {
        console.log(`TransactionId:${this.transactionId}-Borrower:${this.borrower.getId()}-Book:${this.book.getTitle()}-Days:${this.days}-TotalCost:${this.totalCost}`);
    }
    getBorrowerId() {
        return this.borrower.getId();
    }
    getTotalCost() {
        return this.totalCost;
    }
    getBookId() {
        return this.book.getBookId();
    }
}
class GenericRepository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
    findById(id, idField) {
        return this.items.find(item => item[idField] === id);
    }
    findIndexById(id, idField) {
        return this.items.findIndex(item => item[idField] === id);
    }
    removeById(id, idField) {
        const index = this.findIndexById(id, idField);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}
class LibraryManager {
    constructor() {
        this.booksRepo = new GenericRepository();
        this.borrowersRepo = new GenericRepository();
        this.borrowingRepo = new GenericRepository();
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                console.log("\n=== Library Management ===");
                console.log("1. Them nguoi muon");
                console.log("2. Them sach");
                console.log("3. Cho muon sach");
                console.log("4. Hien thi toan bo nguoi muon");
                console.log("5. Tra sach");
                console.log("6. Hien thi toan bo sach co the muon");
                console.log("7. Hien thi toan bo sach cua nguoi muon");
                console.log("8. Tinh tong doanh thu");
                console.log("9. Dem so luong sach theo the loai");
                console.log("10. Thoat chuong trinh");
                const choice = yield this.prompt("Moi ban chon: ");
                switch (choice) {
                    case "1":
                        yield this.addBorrower();
                        break;
                    case "2":
                        yield this.addBook();
                        break;
                    case "3":
                        yield this.borrowBook();
                        break;
                    case "4":
                        this.listAllBorrowers();
                        break;
                    case "5":
                        yield this.returnBook();
                        break;
                    case "6":
                        this.listAvailableBooks();
                        break;
                    case "7":
                        yield this.listBorrowingByCustomer();
                        break;
                    case "8":
                        this.calculateTotalRevenue();
                        break;
                    case "9":
                        this.countBooksByType();
                        break;
                    case "10":
                        console.log("Tam biet");
                        this.readline.close();
                        return;
                    default:
                        console.log("Lua chon khong hop le. Vui long chon lai");
                        break;
                }
            }
        });
    }
    prompt(question) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => this.readline.question(question, resolve));
        });
    }
    addBorrower() {
        return __awaiter(this, void 0, void 0, function* () {
            const idInput = yield this.prompt("Nhap id nguoi muon: ");
            const id = parseInt(idInput);
            if (isNaN(id)) {
                console.log("ID phai la mot so hop le");
                return yield this.addBorrower();
            }
            const name = yield this.prompt("Nhap ten nguoi muon: ");
            const email = yield this.prompt("Nhap email nguoi muon: ");
            const phone = yield this.prompt("Nhap so dien thoai nguoi muon: ");
            const person = new Person(id, name, email, phone);
            this.borrowersRepo.add(person);
            console.log("Them nguoi muon thanh cong");
            return person;
        });
    }
    addBook() {
        return __awaiter(this, void 0, void 0, function* () {
            const idInput = yield this.prompt("Nhap id sach: ");
            const id = parseInt(idInput);
            if (isNaN(id)) {
                console.log("ID sach phai la mot so hop le");
                return yield this.addBook();
            }
            const title = yield this.prompt("Nhap tieu de sach: ");
            const priceInput = yield this.prompt("Nhap gia thue sach: ");
            const price = parseFloat(priceInput);
            if (isNaN(price)) {
                console.log("Gia thue phai la mot so hop le");
                return yield this.addBook();
            }
            const amountInput = yield this.prompt("Nhap so luong sach thue: ");
            const amount = parseInt(amountInput);
            if (isNaN(amount) || amount < 0) {
                console.log("So luong sach phai la mot so khong am");
                return yield this.addBook();
            }
            const type = yield this.prompt("Nhap loai sach (Tieu thuyet/Khoa hoc/Lich su): ");
            let book;
            switch (type.toLowerCase()) {
                case "tieu thuyet":
                    book = new FictionBook(id, title, price, amount);
                    break;
                case "khoa hoc":
                    book = new ScienceBook(id, title, price, amount);
                    break;
                case "lich su":
                    book = new HistoryBook(id, title, price, amount);
                    break;
                default:
                    console.log("Loai sach khong hop le. Vui long nhap: Tieu thuyet, Khoa hoc hoac Lich su");
                    return yield this.addBook();
            }
            this.booksRepo.add(book);
            console.log("Them sach thanh cong");
        });
    }
    borrowBook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookIdInput = yield this.prompt("Nhap id sach muon muon: ");
            const bookId = parseInt(bookIdInput);
            if (isNaN(bookId)) {
                console.log("ID sach phai la mot so hop le");
                return;
            }
            const book = this.booksRepo.findById(bookId, "getBookId");
            if (!book || !book.isBookAvailable()) {
                console.log("Sach khong ton tai hoac da het");
                return;
            }
            const borrowerIdInput = yield this.prompt("Nhap id nguoi muon: ");
            const borrowerId = parseInt(borrowerIdInput);
            if (isNaN(borrowerId)) {
                console.log("ID nguoi muon phai la mot so hop le");
                return;
            }
            const borrower = this.borrowersRepo.findById(borrowerId, "getId");
            if (!borrower) {
                console.log("Nguoi muon khong ton tai");
                return;
            }
            const daysInput = yield this.prompt("Nhap so ngay muon: ");
            const days = parseInt(daysInput);
            if (isNaN(days) || days < 1) {
                console.log("So ngay muon phai la mot so lon hon 0");
                return;
            }
            book.borrowBook();
            const transactionId = this.borrowingRepo.getAll().length + 1;
            const borrowing = new Borrowing(transactionId, borrower, book, days);
            this.borrowingRepo.add(borrowing);
            borrowing.getDetails();
            console.log("Muon sach thanh cong");
            return borrowing;
        });
    }
    listAllBorrowers() {
        const borrowers = this.borrowersRepo.getAll();
        if (borrowers.length === 0) {
            console.log("Khong co nguoi muon nao");
            return;
        }
        borrowers.forEach(borrower => borrower.getDetails());
    }
    returnBook() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookIdInput = yield this.prompt("Nhap id sach muon tra: ");
            const bookId = parseInt(bookIdInput);
            if (isNaN(bookId)) {
                console.log("ID sach phai la mot so hop le");
                return;
            }
            const borrowing = this.borrowingRepo.findById(bookId, "getBookId");
            if (!borrowing) {
                console.log("Khong tim thay giao dich muon sach");
                return;
            }
            const book = this.booksRepo.findById(bookId, "getBookId");
            if (book) {
                book.returnBook();
                this.borrowingRepo.removeById(bookId, "getBookId");
                console.log("Tra sach thanh cong");
            }
        });
    }
    listAvailableBooks() {
        const availableBooks = this.booksRepo.getAll().filter(book => book.isBookAvailable());
        if (availableBooks.length === 0) {
            console.log("Khong co sach nao co the muon");
            return;
        }
        availableBooks.forEach(book => console.log(`Id:${book.getBookId()}-Title:${book.getTitle()}-Type:${book.getType()}`));
    }
    listBorrowingByCustomer() {
        return __awaiter(this, void 0, void 0, function* () {
            const customerIdInput = yield this.prompt("Nhap id nguoi muon: ");
            const customerId = parseInt(customerIdInput);
            if (isNaN(customerId)) {
                console.log("ID nguoi muon phai la mot so hop le");
                return;
            }
            const borrowings = this.borrowingRepo.getAll().filter(borrowing => borrowing.getBorrowerId() === customerId);
            if (borrowings.length === 0) {
                console.log("Nguoi muon nay khong co sach nao dang muon");
                return;
            }
            borrowings.forEach(borrowing => borrowing.getDetails());
        });
    }
    calculateTotalRevenue() {
        const total = this.borrowingRepo.getAll().reduce((sum, borrowing) => sum + borrowing.getTotalCost(), 0);
        console.log(`Tong doanh thu: ${total}`);
    }
    countBooksByType() {
        const books = this.booksRepo.getAll();
        const typeCounts = {
            "Tieu thuyet": 0,
            "Khoa hoc": 0,
            "Lich su": 0
        };
        books.forEach(book => {
            if (book.getType() in typeCounts) {
                typeCounts[book.getType()] += book.isBookAvailable() ? 1 : 0;
            }
        });
        console.log("So luong sach theo the loai:");
        for (const [type, count] of Object.entries(typeCounts)) {
            console.log(`${type}: ${count}`);
        }
    }
}
const library = new LibraryManager();
library.start();
