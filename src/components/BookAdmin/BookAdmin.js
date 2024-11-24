import React from 'react';

const BookAdmin = ({ book, onSoftDelete, onRestock, onEdit, onDelete }) => {
    return (
        <div style={styles.bookContainer}>
            <img src={book.imageUrl} alt={book.name} style={styles.bookImage} />
            <div style={styles.bookInfo}>
                <h3 style={styles.bookName}>{book.name}</h3>
                <p style={styles.categoryName}>Danh mục: {book.categoryName}</p>
            </div>
            <div style={styles.buttonGroup}>
                {/* Nút soft delete */}
                <button
                    style={{ ...styles.button, ...styles.softDeleteButton }}
                    onClick={() => onSoftDelete(book.id)}
                >
                    ✔
                </button>

                {/* Nút nhập hàng */}
                <button
                    style={{ ...styles.button, ...styles.restockButton }}
                    onClick={() => onRestock(book.id)}
                >
                    Nhập hàng
                </button>

                {/* Nút sửa */}
                <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => onEdit(book.id)}
                >
                    Sửa
                </button>

                {/* Nút xóa */}
                <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => onDelete(book.id)}
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

// CSS styles for the component
const styles = {
    bookContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    bookImage: {
        width: '80px',
        height: '120px',
        objectFit: 'cover',
        marginRight: '15px',
        borderRadius: '5px',
    },
    bookInfo: {
        flex: 1,
        marginRight: '15px',
    },
    bookName: {
        fontSize: '16px',
        margin: '0 0 5px 0',
    },
    categoryName: {
        fontSize: '14px',
        color: '#555',
    },
    buttonGroup: {
        display: 'flex',
        gap: '8px',
    },
    button: {
        padding: '6px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        borderRadius: '4px',
        border: 'none',
    },
    softDeleteButton: {
        backgroundColor: '#f5c6cb',
        color: '#721c24',
    },
    restockButton: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    editButton: {
        backgroundColor: '#bee5eb',
        color: '#0c5460',
    },
    deleteButton: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
};

export default BookAdmin;
