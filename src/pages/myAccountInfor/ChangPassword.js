import React from "react";

const ChangePassword = () => {
  return (
    <div>
      <h2>Đổi mật khẩu</h2>
      <form>
        <div>
          <label>Mật khẩu cũ:</label>
          <input type="password" />
        </div>
        <div>
          <label>Mật khẩu mới:</label>
          <input type="password" />
        </div>
        <div>
          <label>Xác nhận mật khẩu:</label>
          <input type="password" />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default ChangePassword;
