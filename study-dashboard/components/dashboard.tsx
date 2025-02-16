'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {StudyMaterials} from '@/components/study-materials';
import {ModeToggle} from '@/components/mode-toggle';
import {Auth} from '@/components/auth';

export function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [studyActive, setStudyActive] = useState(false);
  const [studyTopic, setStudyTopic] = useState('');

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem('phoneNumber');
    if (storedPhoneNumber) {
      setAuthenticated(true);
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  const handleAuthenticated = (phone: string) => {
    setAuthenticated(true);
    setPhoneNumber(phone);
  };

  const handleStudyToggle = async () => {
    try {
      const response = await fetch('/api/toggle-study', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({studyActive: !studyActive, phoneNumber}),
      });
      if (response.ok) {
        setStudyActive(!studyActive);
      }
    } catch (error) {
      console.error('Error toggling study mode:', error);
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/set-study-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({topic: studyTopic, phoneNumber}),
      });
      if (response.ok) {
        console.log('Study topic set successfully');
      }
    } catch (error) {
      console.error('Error setting study topic:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('phoneNumber');
    setAuthenticated(false);
    setPhoneNumber('');
  };

  if (!authenticated) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Study Dashboard</CardTitle>
          <div className='flex items-center space-x-2'>
            <ModeToggle />
            <Button variant='outline' onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <CardDescription>
          Manage your study sessions and view materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='control' className='w-full'>
          <TabsList>
            <TabsTrigger value='control'>Control</TabsTrigger>
            <TabsTrigger value='materials'>Study Materials</TabsTrigger>
          </TabsList>
          <TabsContent value='control'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='study-mode'
                  checked={studyActive}
                  onCheckedChange={handleStudyToggle}
                />
                <Label htmlFor='study-mode'>Study Mode</Label>
              </div>
              <form onSubmit={handleTopicSubmit} className='space-y-2'>
                <Label htmlFor='study-topic'>Study Topic</Label>
                <Input
                  id='study-topic'
                  placeholder='e.g., Linear Algebra exam next week'
                  value={studyTopic}
                  onChange={(e) => setStudyTopic(e.target.value)}
                />
                <Button type='submit'>Set Topic</Button>
              </form>
            </div>
          </TabsContent>
          <TabsContent value='materials'>
            <StudyMaterials phoneNumber={phoneNumber} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
