import os
from pathlib import Path

def aggregate_code_files(source_folder, output_file_path):
    """
    Tổng hợp nội dung của các file mã nguồn trong một thư mục
    và ghi vào một file text duy nhất.
    """
    
    # Chuyển đổi đường dẫn đầu vào thành đối tượng Path
    folder_path = Path(source_folder)
    
    # Kiểm tra xem thư mục có tồn tại không
    if not folder_path.is_dir():
        print(f"Lỗi: Thư mục không tồn tại tại đường dẫn: {source_folder}")
        return

    # Mở file output để ghi
    with open(output_file_path, 'w', encoding='utf-8') as outfile:
        # Duyệt qua tất cả các file trong thư mục và các thư mục con
        for root, dirs, files in os.walk(folder_path):
            for file_name in files:
                # Tạo đường dẫn đầy đủ tới file
                file_path = Path(root) / file_name
                
                # Bỏ qua chính file đang chạy để tránh lặp vô tận
                if file_path.resolve() == Path(os.path.abspath(__file__)).resolve():
                    continue

                try:
                    # Đọc nội dung của file
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                    
                    # Ghi đường dẫn file và nội dung vào file output
                    src_index = str(file_path).find("src")
                    shortened_path = str(file_path)[src_index:]
                    outfile.write(f"--- File: {shortened_path} ---\n")
                    outfile.write(content)
                    outfile.write("\n\n") # Thêm một dòng trống để phân tách các file
                    
                except UnicodeDecodeError:
                    # Bỏ qua các file không phải text hoặc có mã hóa khác UTF-8
                    print(f"Bỏ qua file (không phải text hoặc lỗi mã hóa): {file_path}")
                except Exception as e:
                    # Xử lý các lỗi khác có thể xảy ra
                    print(f"Lỗi khi xử lý file {file_path}: {e}")

# --- Sử dụng chức năng ---
if __name__ == "__main__":
    # Lấy đường dẫn của thư mục chứa file python này
    # Dòng này tự động xác định đường dẫn thư mục mà bạn đang chạy file này
    source_directory = os.path.dirname(os.path.abspath(__file__))
    
    # Tên file output
    output_text_file = "all_code.txt"
    
    # Gọi hàm để thực hiện
    aggregate_code_files(source_directory, output_text_file)
    print(f"\nĐã tổng hợp code từ '{source_directory}' vào file '{output_text_file}'.")