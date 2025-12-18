import React, { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import "./App.css"
// import ThemeToggle from "./ThemeToggle"

const COLORS = ["#10b981", "#f59e0b", "#f97316", "#84cc16", "#a855f7"]

const App = () => {
  const [budget, setBudget] = useState(Number(localStorage.getItem("budget")) || 0)
  const [savingGoal, setSavingGoal] = useState(Number(localStorage.getItem("savingGoal")) || 0)
  const [budgetInput, setBudgetInput] = useState("")
  const [savingInput, setSavingInput] = useState("")
  const [expenceInput, setExpenseInput] = useState({
    title: "",
    amount: "",
    category: "General",
  })

  const [expences, setExpences] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ===== Set Budget =====
  const handleBudget = () => {
    if (!budgetInput || budgetInput < 0) {
      alert("Please enter a valid budget!")
      return
    }
    localStorage.setItem("budget", budgetInput)
    setBudget(budgetInput)
    setBudgetInput("")
  }

  // ===== Set Saving Goal =====
  const handleSavingGoal = () => {
    if (!savingInput || savingInput < 0) {
      alert("Please enter a valid saving goal!")
      return
    }
    localStorage.setItem("savingGoal", savingInput)
    setSavingGoal(savingInput)
    setSavingInput("")
  }

  // ===== Add Expense =====
  const handleAddExpence = () => {
    if (!expenceInput.title || !expenceInput.amount) {
      alert("Please enter both title and amount!")
      return
    }

    const newExpence = {
      ...expenceInput,
      date: new Date().toISOString().split("T")[0],
    }

    const updated = [...expences, newExpence]
    setExpences(updated)
    localStorage.setItem("expences", JSON.stringify(updated))

    setExpenseInput({ title: "", amount: "", category: "General" })
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expences")) || []
    setExpences(saved)
  }, [])

  // ===== Delete Expense =====
  const handleDeleteExp = (index) => {
    const updated = expences.filter((_, i) => i !== index)
    setExpences(updated)
    localStorage.setItem("expences", JSON.stringify(updated))
  }

  // ===== Calculations =====
  let totalExpense = 0
  for (let i = 0; i < expences.length; i++) {
    totalExpense += Number(expences[i].amount)
  }

  const remainingBalance = budget - totalExpense

  let savingProgress = 0
  if (savingGoal > 0) {
    savingProgress = (remainingBalance / savingGoal) * 100
    if (savingProgress > 100) savingProgress = 100
  }

  // ===== Reset =====
  const handleReset = () => {
    setBudget(0)
    setSavingGoal(0)
    setBudgetInput("")
    setSavingInput("")
    setExpenseInput({ title: "", amount: "", category: "General" })
    setExpences([])

    localStorage.removeItem("budget")
    localStorage.removeItem("savingGoal")
    localStorage.removeItem("expences")
  }

  // ===== Edit =====
  const handleEditExp = (index) => {
    setEditIndex(index)
    setExpenseInput(expences[index])
  }

  const handleSaveExp = (index) => {
    const updated = [...expences]
    updated[index] = {
      ...updated[index],
      title: expenceInput.title,
      amount: Number(expenceInput.amount),
      category: expenceInput.category,
    }

    setExpences(updated)
    localStorage.setItem("expences", JSON.stringify(updated))
    setEditIndex(null)
    setExpenseInput({ title: "", amount: "", category: "General" })
  }

  // ===== Pie Data =====
  const pieData = []
  expences.forEach((exp) => {
    const found = pieData.find((p) => p.name === exp.category)
    found
      ? (found.value += Number(exp.amount))
      : pieData.push({ name: exp.category, value: Number(exp.amount) })
  })

  const filteredExpences = expences.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-3xl font-bold">
            💼 Smart Budget Tracker
          </h1>
          {/* <ThemeToggle /> */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Budget Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputCard
            label="Set Monthly Budget"
            value={budgetInput}
            onChange={setBudgetInput}
            onClick={handleBudget}
            btnColor="emerald"
          />

          <InputCard
            label="Set Savings Goal"
            value={savingInput}
            onChange={setSavingInput}
            onClick={handleSavingGoal}
            btnColor="lime"
          />

          <button
            onClick={handleReset}
            className="w-full h-[45px] lg:h-[55px] bg-rose-500 text-white rounded-xl font-semibold shadow"
          >
            Reset All Data
          </button>

        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Budget" value={`₹${budget}`} color="emerald" />
          <SummaryCard title="Total Expense" value={`₹${totalExpense}`} color="rose" />
          <SummaryCard title="Remaining Balance" value={`₹${remainingBalance}`} color="lime" />
          <SummaryCard title="Savings Progress" value={`${Math.round(savingProgress)}%`} color="violet">
            <div className="w-full bg-violet-200 rounded-full h-3 mt-3">
              <div
                className="bg-violet-700 h-3 rounded-full"
                style={{ width: `${savingProgress}%` }}
              />
            </div>
          </SummaryCard>
        </div>

        {/* Add Expense */}
        <div className="bg-white rounded-xl shadow border p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            ➕ Add New Expense
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="px-4 py-3 border rounded-lg"
              placeholder="Expense Title"
              value={expenceInput.title}
              onChange={(e) =>
                setExpenseInput({ ...expenceInput, title: e.target.value })
              }
            />
            <input
              type="number"
              className="px-4 py-3 border rounded-lg"
              placeholder="Amount (₹)"
              value={expenceInput.amount}
              onChange={(e) =>
                setExpenseInput({ ...expenceInput, amount: Number(e.target.value) })
              }
            />
            <select
              className="px-4 py-3 border rounded-lg"
              value={expenceInput.category}
              onChange={(e) =>
                setExpenseInput({ ...expenceInput, category: e.target.value })
              }
            >
              <option>General</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Rent</option>
              <option>Shopping</option>
              <option>Entertainment</option>
            </select>
          </div>

          <button
            onClick={handleAddExpence}
            className="mt-6 w-full sm:w-auto px-8 py-3 bg-emerald-500 text-white rounded-lg"
          >
            Add Expense
          </button>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-semibold mb-4">
            Expense Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow border p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">📋 Expense List</h2>
            <input
              className="px-4 py-2 border rounded-lg"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-slate-200 rounded-lg">
              <thead className="bg-emerald-100 text-emerald-900">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpences.length > 0 ? (filteredExpences.map((exp, index) =>
                (<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  {editIndex === index ? (<> <td className="py-3 px-4">
                    <input className="border rounded px-2 py-1 w-full" type="text" value={expenceInput.title}
                      onChange={(e) => setExpenseInput({ ...expenceInput, title: e.target.value })} />
                  </td>
                    <td className="py-3 px-4">
                      <input type="number" value={expenceInput.amount} onChange={(e) => setExpenseInput({ ...expenceInput, amount: e.target.value })} className="border rounded px-2 py-1 w-full" />
                    </td>
                    <td className="py-3 px-4">
                      <select value={expenceInput.category} onChange={(e) => setExpenseInput({ ...expenceInput, category: e.target.value })} className="border rounded px-2 py-1 w-full" >
                        <option>General</option>
                        <option>Food</option>
                        <option>Travel</option>
                        <option>Rent</option>
                        <option>Shopping</option>
                        <option>Entertainment</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">{exp.date}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                        onClick={() => handleSaveExp(index)} > Save </button> </td>
                  </>)
                    : (<> <td className="py-3 px-4">{exp.title}</td>
                      <td className="py-3 px-4">{exp.amount}</td>
                      <td className="py-3 px-4">{exp.category}</td>
                      <td className="py-3 px-4">{exp.date}</td>
                      <td className="py-3 px-4 space-x-2">
                        <button className="px-3 py-1 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm"
                          onClick={() => handleEditExp(index)}> Edit </button>
                        <button className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm" onClick={() => handleDeleteExp(index)} > Delete </button>
                      </td> </>)} </tr>))) :
                  (<tr> {expences.length === 0 ? (<td colSpan="5" className="text-center py-6 text-slate-500 italic" > No expenses added yet. </td>) :
                    (<td colSpan="5" className="text-center py-6 text-slate-500 italic" > No expenses found. </td>)} </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

const InputCard = ({ label, value, onChange, onClick, btnColor }) => (
  <div className="rounded-xl p-6 border bg-white shadow">
    <label className="text-sm font-semibold mb-2 block">{label}</label>
    <div className="flex gap-2">
      <input
        type="number"
        className="flex-1 px-3 py-2 border rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        onClick={onClick}
        className={`px-4 bg-${btnColor}-500 text-white rounded-lg`}
      >
        Set
      </button>
    </div>
  </div>
)

const SummaryCard = ({ title, value, color, children }) => (
  <div className={`rounded-xl p-6 border bg-${color}-50`}>
    <p className="text-sm font-semibold mb-1">{title}</p>
    <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
    {children}
  </div>
)

export default App
