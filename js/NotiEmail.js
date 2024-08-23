document.getElementById('emailForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn form gửi mặc định

    var form = event.target;
    var formData = new FormData(form);

    // Thêm tham số để ngăn caching
    const url = form.action + '?_=' + new Date().getTime();

    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            // Kiểm tra xem dữ liệu phản hồi có phải là văn bản không
            if (typeof data === 'string') {
                document.getElementById('responseMessage').style.display = 'block';
                document.getElementById('responseMessage').innerHTML = data; // Hiển thị thông báo từ server
            } else {
                document.getElementById('responseMessage').style.display = 'block';
                document.getElementById('responseMessage').innerHTML = 'Có lỗi xảy ra khi gửi email.';
            }
            form.reset(); // Reset form sau khi gửi thành công
        })
        .catch(error => {
            document.getElementById('responseMessage').style.display = 'block';
            document.getElementById('responseMessage').innerHTML = 'Có lỗi xảy ra khi gửi email.';
            console.error('Error:', error);
        });
});