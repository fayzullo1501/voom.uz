import React, { useEffect, useState } from 'react';
import { Filter, Eye, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import './Users.css';
import placeholderAvatar from '../../../assets/avatar-placeholder.svg';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    phoneVerified: '',
    emailVerified: '',
    isDriver: '',
    role: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    birthDate: ''
  });

  const USERS_PER_PAGE = 15;
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    fetchUsers();
    fetchMe();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json();
        if (!Array.isArray(data)) {
          console.error('❗ users API вернул не массив:', data);
          return;
        }
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json();
      setAdmin(data);
    } catch (err) {
      console.error('Ошибка получения админа:', err);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = users.filter((u) => {
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      return (
        fullName.includes(query) ||
        u._id.slice(-6).includes(query) ||
        (u.phone || '').includes(query) ||
        (u.email || '').toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    const filtered = users.filter((u) => {
      const phone = filterCriteria.phoneVerified ? (filterCriteria.phoneVerified === 'yes' ? u.phone : !u.phone) : true;
      const email = filterCriteria.emailVerified ? (filterCriteria.emailVerified === 'yes' ? u.email : !u.email) : true;
      const driver = filterCriteria.isDriver ? (filterCriteria.isDriver === 'yes' ? u.isDriver : !u.isDriver) : true;
      const role = filterCriteria.role ? u.role === filterCriteria.role : true;
      return phone && email && driver && role;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setFilterCriteria({ phoneVerified: '', emailVerified: '', isDriver: '', role: '' });
    setFilteredUsers(users);
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      const ids = paginatedUsers.map(u => u._id);
      setSelectedIds(ids);
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openEdit = () => {
    if (selectedIds.length === 1) {
      const user = filteredUsers.find(u => u._id === selectedIds[0]);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : ''
      });
      setShowEditModal(true);
    }
  };

  const handleAddUser = async () => {
    if (!formData.email || !formData.password) {
      return alert('Поля "Почта" и "Пароль" обязательны');
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/admin-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка создания');

      await fetchUsers();
      setShowAddModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async () => {
  if (!selectedIds.length || !formData.email) {
    return alert('Выберите пользователя и заполните почту');
  }

  try {
    const updatePayload = { ...formData };
    if (!formData.password) {
      delete updatePayload.password; // 🔐 не отправляем пустой пароль
    }

    const res = await fetch(`${process.env.REACT_APP_API_BASE}/users/${selectedIds[0]}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(updatePayload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка обновления');

    await fetchUsers();
    setShowEditModal(false);
  } catch (err) {
    alert(err.message);
  }
};

  const handleDeleteUsers = async () => {
    if (!selectedIds.length) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка удаления');

      await fetchUsers();
      setSelectedIds([]);
      setSelectAll(false);
      setShowDeleteConfirm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const paginatedUsers = (Array.isArray(filteredUsers) ? filteredUsers : []).slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
  return (
    <div className="users-page">
      {/* Header */}
      <div className="users-topbar">
        <h2 className="page-title">Пользователи</h2>
        <div className="admin-info">
          <span>{admin?.firstName || 'Администратор'}</span>
          <img
            src={admin?.avatar?.startsWith('/uploads/')
              ? `${process.env.REACT_APP_API_BASE.replace('/api', '')}${admin.avatar}`
              : placeholderAvatar}
            alt="admin"
            className="admin-avatar"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="users-actions-row">
        <div className="left-actions">
          <button className="plain-btn" onClick={() => {
            setFormData({ firstName: '', lastName: '', phone: '', email: '', password: '', birthDate: '' });
            setShowAddModal(true);
          }}>Добавить</button>
          <button className="plain-btn" onClick={openEdit} disabled={selectedIds.length !== 1}>Изменить</button>
          <button className="plain-btn danger" onClick={() => setShowDeleteConfirm(true)} disabled={selectedIds.length === 0}>Удалить</button>
        </div>
        <div className="right-actions">
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="icon-btn" onClick={() => setShowFilter(true)}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>№</th>
              <th>ID</th>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Почта</th>
              <th>Водитель</th>
              <th>Дата регистрации</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user._id} className={user.passportStatus === 'pending' ? 'highlight-warning' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </td>
                <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                <td>{user._id.slice(-6)}</td>
                <td>{user.firstName || '-'} {user.lastName || ''}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.email}</td>
                <td>{user.isDriver ? 'Да' : 'Нет'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Eye
                    className="eye-icon"
                    onClick={() => navigate(`/${lang}/admin/dashboard/users/${user._id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="filter-modal">
          <div className="filter-box">
            <div className="filter-header">
              <h3>Фильтр</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowFilter(false)} />
            </div>

            <div className="filter-field">
              <label>Подтверждён телефон:</label>
              <select value={filterCriteria.phoneVerified} onChange={(e) => setFilterCriteria({ ...filterCriteria, phoneVerified: e.target.value })}>
                <option value="">Любой</option>
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Подтверждена почта:</label>
              <select value={filterCriteria.emailVerified} onChange={(e) => setFilterCriteria({ ...filterCriteria, emailVerified: e.target.value })}>
                <option value="">Любая</option>
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Водитель:</label>
              <select value={filterCriteria.isDriver} onChange={(e) => setFilterCriteria({ ...filterCriteria, isDriver: e.target.value })}>
                <option value="">Любой</option>
                <option value="yes">Да</option>
                <option value="no">Нет</option>
              </select>
            </div>

            <div className="filter-field">
              <label>Роль:</label>
              <select value={filterCriteria.role} onChange={(e) => setFilterCriteria({ ...filterCriteria, role: e.target.value })}>
                <option value="">Любая</option>
                <option value="user">Пользователь</option>
                <option value="admin">Админ</option>
              </select>
            </div>

            <div className="filter-buttons">
              <button className="plain-btn" onClick={handleApplyFilter}>Сохранить</button>
              <button className="plain-btn" onClick={handleClearFilter}>Очистить</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="filter-modal">
          <div className="filter-box">
            <div className="filter-header">
              <h3>{showAddModal ? 'Добавить пользователя' : 'Изменить пользователя'}</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }} />
            </div>

            {['firstName', 'lastName', 'phone', 'email', 'password', 'birthDate'].map(field => (
              <div className="filter-field" key={field}>
                <label>{{
                  firstName: 'Имя', lastName: 'Фамилия', phone: 'Тел. номер',
                  email: 'Почта *', password: 'Пароль *', birthDate: 'Дата рождения'
                }[field]}</label>
                <input
                  type={field === 'birthDate' ? 'date' : (field === 'password' ? 'password' : 'text')}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required={['email', 'password'].includes(field)}
                />
              </div>
            ))}

            <div className="filter-buttons">
              <button className="plain-btn" onClick={showAddModal ? handleAddUser : handleUpdateUser}>Сохранить</button>
              <button className="plain-btn" onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="filter-modal">
          <div className="filter-box">
            <div className="filter-header">
              <h3>Удалить выбранных пользователей?</h3>
              <X style={{ cursor: 'pointer' }} onClick={() => setShowDeleteConfirm(false)} />
            </div>
            <div className="filter-buttons">
              <button className="plain-btn danger" onClick={handleDeleteUsers}>Удалить</button>
              <button className="plain-btn" onClick={() => setShowDeleteConfirm(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
