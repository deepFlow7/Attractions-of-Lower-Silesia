import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, MenuItem } from '@mui/material';
import { Attraction, Photo, possible_type, subtypes } from '../types';

interface NewAttractionFormProps {
  onSubmit: (attraction: Attraction) => void;
}

const NewAttractionForm: React.FC<NewAttractionFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<possible_type>('Type1');
  const [subtype, setSubtype] = useState<subtypes>('Subtype1');
  const [description, setDescription] = useState<string>('');
  const [interactivity, setInteractivity] = useState<number>(0);
  const [timeItTakes, setTimeItTakes] = useState<number>(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoCaptions, setPhotoCaptions] = useState<string[]>([]);

  const handleAddPhoto = () => {
    const newPhotos = [...photos];
    newPhotos.push({ id: photos.length + 1, attraction_id: 0, photo: photoUrls[photos.length], caption: photoCaptions[photos.length] });
    setPhotos(newPhotos);
    setPhotoUrls([...photoUrls, '']);
    setPhotoCaptions([...photoCaptions, '']);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
    setPhotoCaptions(photoCaptions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newAttraction: Attraction = {
      id: Math.floor(Math.random() * 1000) + 1,
      name,
      coords: { x: 0, y: 0 },
      type,
      subtype,
      interactivity,
      time_it_takes: timeItTakes,
      description,
      photos
    };
    onSubmit(newAttraction);
    // Clear form fields
    setName('');
    setType('Type1');
    setSubtype('Subtype1');
    setDescription('');
    setInteractivity(0);
    setTimeItTakes(0);
    setPhotos([]);
    setPhotoUrls([]);
    setPhotoCaptions([]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Nowa Atrakcja</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Nazwa" value={name} onChange={(e) => setName(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <TextField select fullWidth label="Typ" value={type} onChange={(e) => setType(e.target.value as possible_type)}>
          <MenuItem value="Type1">Type1</MenuItem>
          <MenuItem value="Type2">Type2</MenuItem>
          <MenuItem value="Type3">Type3</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField select fullWidth label="Podtyp" value={subtype} onChange={(e) => setSubtype(e.target.value as subtypes)}>
          <MenuItem value="Subtype1">Subtype1</MenuItem>
          <MenuItem value="Subtype2">Subtype2</MenuItem>
          <MenuItem value="Subtype3">Subtype3</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth multiline rows={4} label="Opis" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <TextField type="number" fullWidth label="Interaktywność (1-10)" value={interactivity} onChange={(e) => setInteractivity(parseInt(e.target.value))} />
      </Grid>
      <Grid item xs={12}>
        <TextField type="number" fullWidth label="Czas zwiedzania (minuty)" value={timeItTakes} onChange={(e) => setTimeItTakes(parseInt(e.target.value))} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>Zdjęcia</Typography>
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item key={index}>
              <img src={photo.photo} alt={`Photo ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="caption">{photo.caption}</Typography>
              <Button variant="outlined" onClick={() => handleRemovePhoto(index)}>Usuń</Button>
            </Grid>
          ))}
          <Grid item>
            <TextField fullWidth label="URL Zdjęcia" value={photoUrls[photos.length] || ''} onChange={(e) => setPhotoUrls([...photoUrls.slice(0, photos.length), e.target.value])} />
            <TextField fullWidth label="Podpis Zdjęcia" value={photoCaptions[photos.length] || ''} onChange={(e) => setPhotoCaptions([...photoCaptions.slice(0, photos.length), e.target.value])} />
            <Button variant="contained" onClick={handleAddPhoto}>Dodaj Zdjęcie</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Zapisz Atrakcję</Button>
      </Grid>
    </Grid>
  );
};

export default NewAttractionForm;
