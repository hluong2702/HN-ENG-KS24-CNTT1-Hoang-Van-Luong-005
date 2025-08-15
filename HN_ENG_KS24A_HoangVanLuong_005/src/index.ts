import { log } from 'console';
import { resolve } from 'path/posix';
import * as readline from 'readline';

class Person {
    private id: number;
    private name: string;
    private email: string;
    private phone: string;

    constructor(id: number, name: string, email: string, phone: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    getDetails(): void {
        console.log(`ID:${this.id}-Name:${this.name}-Email:${this.email}-Phone:${this.phone}`);
    }

    public getId(): number {
        return this.id;
    }
}

abstract class Book {
    private bookId: number;
    protected title: string;
    protected price: number;
    protected amount: number;
    protected type: string;
    protected isAvailable: boolean;

    constructor(bookId: number, title: string, price: number, amount: number, type: string) {
        this.bookId = bookId;
        this.title = title;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.isAvailable = amount > 0;
    }

    borrowBook(): void {
        if (this.amount > 0) {
            this.amount -= 1;
            this.isAvailable = this.amount > 0;
        }
    }

    returnBook(): void {
        this.amount += 1;
        this.isAvailable = true;
    }

    abstract calculateLateFee(daysLate: number): number;

    public getBookId(): number {
        return this.bookId;
    }

    public getTitle(): string {
        return this.title;
    }

    public getType(): string {
        return this.type;
    }

    public isBookAvailable(): boolean {
        return this.isAvailable;
    }

    public getPrice(): number {
        return this.price;
    }
}

class FictionBook extends Book {
    constructor(bookId: number, title: string, price: number, amount: number) {
        super(bookId, title, price, amount, "Tieu thuyet");
    }

    calculateLateFee(daysLate: number): number {
        return daysLate * 5000;
    }
}

class ScienceBook extends Book {
    constructor(bookId: number, title: string, price: number, amount: number) {
        super(bookId, title, price, amount, "Khoa hoc");
    }

    calculateLateFee(daysLate: number): number {
        return daysLate * 10000;
    }
}

class HistoryBook extends Book {
    constructor(bookId: number, title: string, price: number, amount: number) {
        super(bookId, title, price, amount, "Lich su");
    }

    calculateLateFee(daysLate: number): number {
        return daysLate * 7000;
    }
}

class Borrowing {
    private transactionId: number;
    private borrower: Person;
    private book: Book;
    private days: number;
    private totalCost: number;

    constructor(transactionId: number, borrower: Person, book: Book, days: number) {
        this.transactionId = transactionId;
        this.borrower = borrower;
        this.book = book;
        this.days = days;
        this.totalCost = book.getPrice() + book.calculateLateFee(Math.max(0, days - 7));
    }

    getDetails(): void {
        console.log(`TransactionId:${this.transactionId}-Borrower:${this.borrower.getId()}-Book:${this.book.getTitle()}-Days:${this.days}-TotalCost:${this.totalCost}`);
    }

    public getBorrowerId(): number {
        return this.borrower.getId();
    }

    public getTotalCost(): number {
        return this.totalCost;
    }

    public getBookId(): number {
        return this.book.getBookId();
    }
}

class GenericRepository<T extends Record<string, any>> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getAll(): T[] {
        return this.items;
    }

    findById(id: number, idField: keyof T): T | undefined {
        return this.items.find(item => item[idField] === id);
    }

    findIndexById(id: number, idField: keyof T): number {
        return this.items.findIndex(item => item[idField] === id);
    }

    removeById(id: number, idField: keyof T): void {
        const index = this.findIndexById(id, idField);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}

class LibraryManager {
    private booksRepo: GenericRepository<Book> = new GenericRepository<Book>();
    private borrowersRepo: GenericRepository<Person> = new GenericRepository<Person>();
    private borrowingRepo: GenericRepository<Borrowing> = new GenericRepository<Borrowing>();
    private readline: readline.Interface;

    constructor() {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async start(): Promise<void> {
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
            const choice = await this.prompt("Moi ban chon: ");

            switch (choice) {
                case "1":
                    await this.addBorrower();
                    break;
                case "2":
                    await this.addBook();
                    break;
                case "3":
                    await this.borrowBook();
                    break;
                case "4":
                    this.listAllBorrowers();
                    break;
                case "5":
                    await this.returnBook();
                    break;
                case "6":
                    this.listAvailableBooks();
                    break;
                case "7":
                    await this.listBorrowingByCustomer();
                    break;
                case "8":
                    this.calculateTotalRevenue();
                    break;
                case "9":
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
    }

    private async prompt(question: string): Promise<string> {
        return new Promise(resolve => this.readline.question(question, resolve));
    }

    async addBorrower(): Promise<Person> {
        const idInput = await this.prompt("Nhap id nguoi muon: ");
        const id = parseInt(idInput);
        if (isNaN(id)) {
            console.log("ID phai la mot so hop le");
            return await this.addBorrower();
        }
        const name = await this.prompt("Nhap ten nguoi muon: ");
        const email = await this.prompt("Nhap email nguoi muon: ");
        const phone = await this.prompt("Nhap so dien thoai nguoi muon: ");
        const person = new Person(id, name, email, phone);
        this.borrowersRepo.add(person);
        console.log("Them nguoi muon thanh cong");
        return person;
    }

    async addBook(): Promise<void> {
        const idInput = await this.prompt("Nhap id sach: ");
        const id = parseInt(idInput);
        if (isNaN(id)) {
            console.log("ID sach phai la mot so hop le");
            return await this.addBook();
        }
        const title = await this.prompt("Nhap tieu de sach: ");
        const priceInput = await this.prompt("Nhap gia thue sach: ");
        const price = parseFloat(priceInput);
        if (isNaN(price)) {
            console.log("Gia thue phai la mot so hop le");
            return await this.addBook();
        }
        const amountInput = await this.prompt("Nhap so luong sach thue: ");
        const amount = parseInt(amountInput);
        if (isNaN(amount) || amount < 0) {
            console.log("So luong sach phai la mot so khong am");
            return await this.addBook();
        }
        const type = await this.prompt("Nhap loai sach (Tieu thuyet/Khoa hoc/Lich su): ");
        let book: Book;
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
                return await this.addBook();
        }
        this.booksRepo.add(book);
        console.log("Them sach thanh cong");
    }

    async borrowBook(): Promise<Borrowing | undefined> {
        const bookIdInput = await this.prompt("Nhap id sach muon muon: ");
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

        const borrowerIdInput = await this.prompt("Nhap id nguoi muon: ");
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

        const daysInput = await this.prompt("Nhap so ngay muon: ");
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
    }

    listAllBorrowers(): void {
        const borrowers = this.borrowersRepo.getAll();
        if (borrowers.length === 0) {
            console.log("Khong co nguoi muon nao");
            return;
        }
        borrowers.forEach(borrower => borrower.getDetails());
    }

    async returnBook(): Promise<void> {
        const bookIdInput = await this.prompt("Nhap id sach muon tra: ");
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
    }

    listAvailableBooks(): void {
        const availableBooks = this.booksRepo.getAll().filter(book => book.isBookAvailable());
        if (availableBooks.length === 0) {
            console.log("Khong co sach nao co the muon");
            return;
        }
        availableBooks.forEach(book => console.log(`Id:${book.getBookId()}-Title:${book.getTitle()}-Type:${book.getType()}`));
    }

    async listBorrowingByCustomer(): Promise<void> {
        const customerIdInput = await this.prompt("Nhap id nguoi muon: ");
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
    }

    calculateTotalRevenue(): void {
        const total = this.borrowingRepo.getAll().reduce((sum, borrowing) => sum + borrowing.getTotalCost(), 0);
        console.log(`Tong doanh thu: ${total}`);
    }
}

const library = new LibraryManager();
library.start();
