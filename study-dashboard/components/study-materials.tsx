'use client';

import {useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WeekCalendar } from './ui/weekcalendar';

type StudyMaterial = {
  id: string;
  content: string;
  timestamp: string;
};

type StudyMaterialsProps = {
  phoneNumber: string;
};

export function StudyMaterials({phoneNumber}: StudyMaterialsProps) {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  useEffect(() => {
    fetch(`/api/study-materials?phoneNumber=${phoneNumber}`)
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch((error) =>
        console.error('Error fetching study materials:', error)
      );
  }, [phoneNumber]);

  console.log('Study materials:', materials);

  return (
    <div className='space-y-4'>
      <WeekCalendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

      {materials?.length === 0 ? (
        <p>No study materials available yet.</p>
      ) : (
        materials?.filter((material) => {
          const materialDate = new Date(material.timestamp);
          return materialDate.getDate() === selectedDay;
        }).map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <CardTitle>Study Material</CardTitle>
              <CardDescription>
                {new Date(material.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {JSON.parse(material.content).map((c: string) =>(
                <p key={c}>{c}</p>
              ))}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
