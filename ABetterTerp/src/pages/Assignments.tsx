import { useState, useEffect } from 'react'

interface Assignment {
  id: number
  title: string
  course: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  type: 'homework' | 'exam' | 'project' | 'lab'
  points: string
}

interface Course {
  code: string
  name: string
  professor: string
}

interface NewAssignment {
  title: string
  course: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  type: 'homework' | 'exam' | 'project' | 'lab'
  points: string
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [newAssignment, setNewAssignment] = useState<NewAssignment>({
    title: '',
    course: '',
    dueDate: '',
    priority: 'medium',
    type: 'homework',
    points: ''
  })

  const colors = {
    umdRed: 'rgb(226, 24, 51)',
    umdBlack: 'rgb(0, 0, 0)',
    white: 'rgb(255, 255, 255)',
    gray50: 'rgb(249, 250, 251)',
    gray100: 'rgb(243, 244, 246)',
    gray200: 'rgb(229, 231, 235)',
    gray300: 'rgb(209, 213, 219)',
    gray600: 'rgb(107, 114, 128)',
    gray700: 'rgb(75, 85, 99)',
    gray800: 'rgb(31, 41, 55)',
    gray900: 'rgb(17, 24, 39)',
    red50: 'rgb(254, 242, 242)',
    red100: 'rgb(254, 226, 226)',
    red200: 'rgb(254, 202, 202)',
    red500: 'rgb(239, 68, 68)',
    red600: 'rgb(220, 38, 38)',
    red700: 'rgb(185, 28, 28)',
    red800: 'rgb(153, 27, 27)',
    yellow50: 'rgb(254, 252, 232)',
    yellow100: 'rgb(254, 243, 199)',
    yellow200: 'rgb(253, 230, 138)',
    yellow400: 'rgb(251, 191, 36)',
    yellow800: 'rgb(146, 64, 14)',
    yellow900: 'rgb(120, 53, 15)',
    blue50: 'rgb(239, 246, 255)',
    blue100: 'rgb(219, 234, 254)',
    blue200: 'rgb(191, 219, 254)',
    blue500: 'rgb(59, 130, 246)',
    blue700: 'rgb(29, 78, 216)',
    blue800: 'rgb(30, 64, 175)',
    blue900: 'rgb(30, 58, 138)',
    green50: 'rgb(240, 253, 244)',
    green100: 'rgb(209, 250, 229)',
    green200: 'rgb(167, 243, 208)',
    green500: 'rgb(16, 185, 129)',
    green600: 'rgb(5, 150, 105)',
    green700: 'rgb(4, 120, 87)',
    green800: 'rgb(6, 95, 70)',
    orange500: 'rgb(245, 158, 11)'
  }

  // Simulated Backend API
  const API = {
    async fetchAssignments(): Promise<Assignment[]> {
      await new Promise(resolve => setTimeout(resolve, 500))
      return [
        { id: 1, title: 'Midterm Exam', course: 'CMSC330', dueDate: '2024-12-10', status: 'pending', priority: 'high', type: 'exam', points: '100' },
        { id: 2, title: 'Project 3: Web Scraper', course: 'CMSC388J', dueDate: '2024-12-15', status: 'in-progress', priority: 'high', type: 'project', points: '50' },
        { id: 3, title: 'Problem Set 5', course: 'MATH240', dueDate: '2024-12-08', status: 'pending', priority: 'medium', type: 'homework', points: '20' },
        { id: 4, title: 'Reading Response: Chapter 7', course: 'ENGL101', dueDate: '2024-12-20', status: 'pending', priority: 'low', type: 'homework', points: '10' },
        { id: 5, title: 'Lab Report: Circuits', course: 'PHYS260', dueDate: '2024-12-12', status: 'pending', priority: 'medium', type: 'lab', points: '25' },
      ]
    },
    
    async fetchCourses(): Promise<Course[]> {
      await new Promise(resolve => setTimeout(resolve, 300))
      return [
        { code: 'CMSC330', name: 'Organization of Programming Languages', professor: 'Dr. Smith' },
        { code: 'CMSC388J', name: 'Web Development with JavaScript', professor: 'Dr. Johnson' },
        { code: 'MATH240', name: 'Linear Algebra', professor: 'Dr. Williams' },
        { code: 'ENGL101', name: 'Academic Writing', professor: 'Prof. Brown' },
        { code: 'PHYS260', name: 'Vibrations, Waves and Optics', professor: 'Dr. Davis' },
      ]
    },
    
    async addAssignment(assignment: NewAssignment): Promise<Assignment> {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { ...assignment, id: Date.now(), status: 'pending' }
    },
    
    async updateAssignment(id: number, updates: Partial<Assignment>): Promise<Assignment> {
      await new Promise(resolve => setTimeout(resolve, 200))
      return { id, ...updates } as Assignment
    },
    
    async deleteAssignment(id: number): Promise<{ success: boolean; id: number }> {
      await new Promise(resolve => setTimeout(resolve, 200))
      return { success: true, id }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        API.fetchAssignments(),
        API.fetchCourses()
      ])
      setAssignments(assignmentsData)
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addAssignment = async () => {
    if (newAssignment.title && newAssignment.course && newAssignment.dueDate) {
      try {
        const created = await API.addAssignment(newAssignment)
        setAssignments([...assignments, created])
        setNewAssignment({ title: '', course: '', dueDate: '', priority: 'medium', type: 'homework', points: '' })
        setShowAddForm(false)
      } catch (error) {
        console.error('Error adding assignment:', error)
      }
    }
  }

  const updateStatus = async (id: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
    try {
      const assignment = assignments.find(a => a.id === id)
      if (assignment) {
        await API.updateAssignment(id, { ...assignment, status: newStatus })
        setAssignments(assignments.map(a => 
          a.id === id ? { ...a, status: newStatus } : a
        ))
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
    }
  }

  const deleteAssignment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await API.deleteAssignment(id)
        setAssignments(assignments.filter(a => a.id !== id))
      } catch (error) {
        console.error('Error deleting assignment:', error)
      }
    }
  }

  const getDaysUntil = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'all') return true
    if (filter === 'overdue') return getDaysUntil(a.dueDate) < 0 && a.status !== 'completed'
    if (filter === 'upcoming') return getDaysUntil(a.dueDate) >= 0 && getDaysUntil(a.dueDate) <= 7
    return a.status === filter
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return colors.green500
      case 'in-progress': return colors.orange500
      default: return colors.gray600
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return colors.red600
      case 'medium': return colors.orange500
      default: return colors.gray600
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'exam': return '📝'
      case 'project': return '💻'
      case 'lab': return '🔬'
      case 'homework': return '📚'
      default: return '📄'
    }
  }

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    overdue: assignments.filter(a => getDaysUntil(a.dueDate) < 0 && a.status !== 'completed').length,
    totalPoints: assignments.reduce((sum, a) => sum + (parseInt(a.points) || 0), 0),
    completedPoints: assignments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (parseInt(a.points) || 0), 0)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.umdRed} 0%, ${colors.umdBlack} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: colors.white }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🐢</div>
          <div style={{ fontSize: '1.5rem' }}>Loading Assignments...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${colors.umdRed} 0%, ${colors.umdBlack} 100%)`, padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: colors.white, borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: `3px solid ${colors.umdRed}`, paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.5rem', color: colors.umdBlack, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🐢 UMD Assignments
              </h1>
              <p style={{ margin: '0.5rem 0 0 0', color: colors.gray600 }}>University of Maryland - Fall 2024</p>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.umdRed }}>
              {stats.completedPoints}/{stats.totalPoints} pts
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: `linear-gradient(135deg, ${colors.gray100} 0%, ${colors.gray200} 100%)`, padding: '1rem', borderRadius: '8px', textAlign: 'center', border: `2px solid ${colors.gray300}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.gray800 }}>{stats.total}</div>
            <div style={{ fontSize: '0.875rem', color: colors.gray600, fontWeight: '500' }}>Total</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${colors.yellow100} 0%, ${colors.yellow200} 100%)`, padding: '1rem', borderRadius: '8px', textAlign: 'center', border: `2px solid ${colors.yellow400}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.yellow800 }}>{stats.pending}</div>
            <div style={{ fontSize: '0.875rem', color: colors.yellow900, fontWeight: '500' }}>Pending</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${colors.blue100} 0%, ${colors.blue200} 100%)`, padding: '1rem', borderRadius: '8px', textAlign: 'center', border: `2px solid ${colors.blue500}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.blue900 }}>{stats.inProgress}</div>
            <div style={{ fontSize: '0.875rem', color: colors.blue800, fontWeight: '500' }}>In Progress</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${colors.green100} 0%, ${colors.green200} 100%)`, padding: '1rem', borderRadius: '8px', textAlign: 'center', border: `2px solid ${colors.green500}` }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.green800 }}>{stats.completed}</div>
            <div style={{ fontSize: '0.875rem', color: colors.green700, fontWeight: '500' }}>Completed</div>
          </div>
          {stats.overdue > 0 && (
            <div style={{ background: `linear-gradient(135deg, ${colors.red100} 0%, ${colors.red200} 100%)`, padding: '1rem', borderRadius: '8px', textAlign: 'center', border: `2px solid ${colors.red500}` }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.red800 }}>{stats.overdue}</div>
              <div style={{ fontSize: '0.875rem', color: colors.red700, fontWeight: '500' }}>Overdue ⚠️</div>
            </div>
          )}
        </div>

        {/* Filter and Add Button */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem', border: `2px solid ${colors.umdRed}`, borderRadius: '6px', background: colors.white, cursor: 'pointer', fontWeight: '500' }}
          >
            <option value="all">All Assignments</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Due This Week</option>
          </select>
          
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ 
              padding: '0.5rem 1.5rem', 
              background: colors.umdRed, 
              color: colors.white, 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(226, 24, 51, 0.3)'
            }}
          >
            {showAddForm ? '✕ Cancel' : '+ Add Assignment'}
          </button>
        </div>

        {/* Add Assignment Form */}
        {showAddForm && (
          <div style={{ background: colors.gray50, padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: `2px solid ${colors.umdRed}` }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: colors.umdBlack }}>New Assignment</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
              />
              <select
                value={newAssignment.course}
                onChange={(e) => setNewAssignment({...newAssignment, course: e.target.value})}
                style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <select
                  value={newAssignment.type}
                  onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value as NewAssignment['type']})}
                  style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
                >
                  <option value="homework">Homework</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                  <option value="lab">Lab</option>
                </select>
                <select
                  value={newAssignment.priority}
                  onChange={(e) => setNewAssignment({...newAssignment, priority: e.target.value as NewAssignment['priority']})}
                  style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="number"
                  placeholder="Points"
                  value={newAssignment.points}
                  onChange={(e) => setNewAssignment({...newAssignment, points: e.target.value})}
                  style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
                />
              </div>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                style={{ padding: '0.5rem', border: `1px solid ${colors.gray300}`, borderRadius: '6px' }}
              />
              <button onClick={addAssignment} style={{ padding: '0.75rem', background: colors.green500, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                Add Assignment
              </button>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAssignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: colors.gray600 }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐢</div>
              <div>No assignments found for this filter.</div>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const daysUntil = getDaysUntil(assignment.dueDate)
              const isOverdue = daysUntil < 0 && assignment.status !== 'completed'
              const courseInfo = courses.find(c => c.code === assignment.course)
              
              return (
                <div key={assignment.id} style={{ 
                  border: `2px solid ${colors.gray200}`, 
                  borderRadius: '8px', 
                  padding: '1.25rem',
                  background: colors.white,
                  borderLeft: `5px solid ${isOverdue ? colors.red500 : getPriorityColor(assignment.priority)}`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(assignment.type)}</span>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', color: colors.umdBlack }}>{assignment.title}</h3>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.umdRed, marginBottom: '0.5rem', fontWeight: '600' }}>
                        {assignment.course} {courseInfo && `- ${courseInfo.name}`}
                      </div>
                      {courseInfo && (
                        <div style={{ fontSize: '0.75rem', color: colors.gray600, marginBottom: '0.5rem' }}>
                          Professor: {courseInfo.professor}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', color: isOverdue ? colors.red500 : colors.gray700, fontWeight: '500' }}>
                          📅 Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {isOverdue && <strong> (OVERDUE!)</strong>}
                          {!isOverdue && daysUntil === 0 && <strong> (TODAY)</strong>}
                          {!isOverdue && daysUntil === 1 && <strong> (Tomorrow)</strong>}
                          {!isOverdue && daysUntil > 1 && daysUntil <= 7 && ` (${daysUntil} days)`}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '4px', 
                          background: getPriorityColor(assignment.priority), 
                          color: colors.white,
                          fontWeight: '600'
                        }}>
                          {assignment.priority.toUpperCase()}
                        </span>
                        {assignment.points && (
                          <span style={{ fontSize: '0.875rem', color: colors.gray600, fontWeight: '600' }}>
                            {assignment.points} pts
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <select
                        value={assignment.status}
                        onChange={(e) => updateStatus(assignment.id, e.target.value as Assignment['status'])}
                        style={{ 
                          padding: '0.5rem', 
                          border: 'none', 
                          borderRadius: '6px',
                          background: getStatusColor(assignment.status),
                          color: colors.white,
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">📋 Pending</option>
                        <option value="in-progress">⏳ In Progress</option>
                        <option value="completed">✅ Completed</option>
                      </select>
                      
                      <button
                        onClick={() => deleteAssignment(assignment.id)}
                        style={{ 
                          padding: '0.5rem 0.75rem', 
                          background: colors.red500, 
                          color: colors.white, 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: `2px solid ${colors.gray200}`, textAlign: 'center', color: colors.gray600, fontSize: '0.875rem' }}>
          <p>Fear the Turtle! 🐢 | University of Maryland</p>
        </div>
      </div>
    </div>
  )
}