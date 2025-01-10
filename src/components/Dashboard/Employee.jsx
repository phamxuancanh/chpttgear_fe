import { useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";


export default function Employee() {
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [employeeForm, setEmployeeForm] = useState({
        name: "",
        role: "",
        status: "active"
    });
    const handleEmployeeSubmit = (e) => {
        e.preventDefault();
        setShowEmployeeModal(false);
    };

    const employees = [
        { id: 1, name: "John Doe", role: "Manager", status: "active", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1" },
        { id: 2, name: "Jane Smith", role: "Developer", status: "active", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1" },
        { id: 3, name: "Mike Johnson", role: "Designer", status: "inactive", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1" }
    ];

    const ActionButton = ({ icon: Icon, onClick, color }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded-full ${color} text-white hover:opacity-80 transition-opacity mr-2`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const Modal = ({ show, onClose, title, children }) => {
        if (!show) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };
    return (
        <div className="flex-1 p-8">
            <Modal
                show={showEmployeeModal}
                onClose={() => setShowEmployeeModal(false)}
                title="Add/Edit Employee"
            >
                <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            value={employeeForm.name}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            value={employeeForm.role}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={employeeForm.status}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                        Save Employee
                    </button>
                </form>
            </Modal>
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Employees</h2>
                    <button
                        onClick={() => setShowEmployeeModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Employee
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={employee.image}
                                                alt={employee.name}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <span>{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{employee.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${employee.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ActionButton icon={FiEdit} color="bg-blue-500" onClick={() => setShowEmployeeModal(true)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
