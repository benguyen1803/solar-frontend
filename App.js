import { useState } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', note: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/contact', form);
      alert(res.data.message);
    } catch (err) {
      alert('Gửi thất bại!');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Yêu cầu tư vấn điện mặt trời</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Họ tên" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Số điện thoại" onChange={handleChange} required />
        <input name="address" placeholder="Địa chỉ lắp đặt" onChange={handleChange} />
        <textarea name="note" placeholder="Nhu cầu cụ thể" onChange={handleChange}></textarea>
        <button type="submit">Gửi thông tin</button>
      </form>
    </div>
  );
}

export default App;
