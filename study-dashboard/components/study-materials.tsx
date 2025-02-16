'use client';

import {useState, useEffect} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      {materials?.length === 0 ? (
        <p>No study materials available yet.</p>
      ) : (
        materials?.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <CardTitle>Study Material</CardTitle>
              <CardDescription>
                {new Date(material.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{material.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
