import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
export default function MediaCard(props) {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
              sx={{ height: 140 }}
        image={props.image}
        title="green iguana"
      />
      <CardContent>
        <h2>
          {props.name}
        </h2>
        <Typography variant="h1" sx={{ color: 'text.secondary' }}>
          {props.time}
        </Typography>
      </CardContent>
      
    </Card>
  );
}
