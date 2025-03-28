
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getUsers,
  addUser,
  deleteUser,
  importQuestions
} from '@/services/mockDatabase';
import { Question, User } from '@/types';

const AdminDashboard = () => {
  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ content: '', answer: '' });
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' as const });

  // Import state
  const [importText, setImportText] = useState('');

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    setQuestions(getQuestions());
    setUsers(getUsers());
  }, []);

  // Question handlers
  const handleAddQuestion = () => {
    if (newQuestion.content.trim() && newQuestion.answer.trim()) {
      const added = addQuestion(newQuestion);
      setQuestions([...questions, added]);
      setNewQuestion({ content: '', answer: '' });
      toast({
        title: "Success",
        description: "Question added successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Question and answer cannot be empty",
        variant: "destructive"
      });
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion && editingQuestion.content.trim() && editingQuestion.answer.trim()) {
      const updated = updateQuestion(editingQuestion.id, {
        content: editingQuestion.content,
        answer: editingQuestion.answer
      });
      
      if (updated) {
        setQuestions(questions.map(q => q.id === updated.id ? updated : q));
        setEditingQuestion(null);
        toast({
          title: "Success",
          description: "Question updated successfully!",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Question and answer cannot be empty",
        variant: "destructive"
      });
    }
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const success = deleteQuestion(id);
      if (success) {
        setQuestions(questions.filter(q => q.id !== id));
        toast({
          title: "Success",
          description: "Question deleted successfully!",
        });
      }
    }
  };

  // User handlers
  const handleAddUser = () => {
    if (newUser.username.trim() && newUser.password.trim()) {
      // Check if username already exists
      if (users.some(u => u.username === newUser.username)) {
        toast({
          title: "Error",
          description: "Username already exists",
          variant: "destructive"
        });
        return;
      }

      const added = addUser(newUser);
      setUsers([...users, added]);
      setNewUser({ username: '', password: '', role: 'student' });
      toast({
        title: "Success",
        description: "Student account created successfully!",
      });
    } else {
      toast({
        title: "Error",
        description: "Username and password cannot be empty",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = deleteUser(id);
      if (success) {
        setUsers(users.filter(u => u.id !== id));
        toast({
          title: "Success",
          description: "User deleted successfully!",
        });
      }
    }
  };

  // Import questions handler
  const handleImportQuestions = () => {
    try {
      if (!importText.trim()) {
        toast({
          title: "Error",
          description: "Import text cannot be empty",
          variant: "destructive"
        });
        return;
      }

      // Parse the text format (assuming format: Question: xxx Answer: yyy)
      const lines = importText.split('\n');
      const parsedQuestions: Array<{content: string, answer: string}> = [];
      
      let currentQuestion = '';
      let currentAnswer = '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Question:')) {
          // If we already have a question in progress, save it
          if (currentQuestion && currentAnswer) {
            parsedQuestions.push({ content: currentQuestion, answer: currentAnswer });
            currentQuestion = '';
            currentAnswer = '';
          }
          
          currentQuestion = trimmedLine.substring('Question:'.length).trim();
        } else if (trimmedLine.startsWith('Answer:')) {
          currentAnswer = trimmedLine.substring('Answer:'.length).trim();
          
          // If we have both question and answer, add them
          if (currentQuestion && currentAnswer) {
            parsedQuestions.push({ content: currentQuestion, answer: currentAnswer });
            currentQuestion = '';
            currentAnswer = '';
          }
        }
      }
      
      // Add any remaining question/answer
      if (currentQuestion && currentAnswer) {
        parsedQuestions.push({ content: currentQuestion, answer: currentAnswer });
      }
      
      if (parsedQuestions.length === 0) {
        toast({
          title: "Error",
          description: "No valid questions found. Format should be 'Question: xxx' followed by 'Answer: yyy'",
          variant: "destructive"
        });
        return;
      }
      
      const imported = importQuestions(parsedQuestions);
      setQuestions([...questions, ...imported]);
      setImportText('');
      
      toast({
        title: "Success",
        description: `Imported ${imported.length} questions successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import questions. Please check the format.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
        
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="questions">Manage Questions</TabsTrigger>
            <TabsTrigger value="students">Manage Students</TabsTrigger>
            <TabsTrigger value="import">Import Questions</TabsTrigger>
          </TabsList>
          
          {/* Questions Tab */}
          <TabsContent value="questions">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Question</CardTitle>
                  <CardDescription>Create a new question and answer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        placeholder="Enter the question"
                        value={newQuestion.content}
                        onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        placeholder="Enter the answer"
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddQuestion}>Add Question</Button>
                  </div>
                </CardContent>
              </Card>

              {editingQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Question</CardTitle>
                    <CardDescription>Update the selected question</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Textarea
                          id="edit-question"
                          value={editingQuestion.content}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, content: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-answer">Answer</Label>
                        <Textarea
                          id="edit-answer"
                          value={editingQuestion.answer}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateQuestion}>Update Question</Button>
                        <Button variant="outline" onClick={() => setEditingQuestion(null)}>Cancel</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>All Questions</CardTitle>
                  <CardDescription>Manage your existing questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-center text-muted-foreground">No questions available. Add some questions above.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Answer</TableHead>
                          <TableHead className="w-[150px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {questions.map((question) => (
                          <TableRow key={question.id}>
                            <TableCell className="font-medium">{question.content}</TableCell>
                            <TableCell>{question.answer}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Students Tab */}
          <TabsContent value="students">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Student</CardTitle>
                  <CardDescription>Create a new student account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddUser}>Add Student</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage your existing users</CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <p className="text-center text-muted-foreground">No users available.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>
                              {user.role !== 'admin' && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Delete
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Import Tab */}
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Questions</CardTitle>
                <CardDescription>
                  Import multiple questions at once. Use the format:
                  <pre className="mt-2 p-2 bg-muted rounded text-sm">
                    Question: What is the capital of France?{'\n'}
                    Answer: Paris is the capital of France.{'\n\n'}
                    Question: What is 2+2?{'\n'}
                    Answer: 4
                  </pre>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Textarea
                    placeholder="Paste your questions and answers here..."
                    className="min-h-[200px]"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                  <Button onClick={handleImportQuestions}>Import Questions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
