import { Card, Image, Label, Rating, Button } from 'semantic-ui-react'

export const MealCard = ({ id, mealLabel, mealType, ratingVal, ratingCount, name, address, imageLink, onShuffle, isShuffleLoading }) => {
    const handleClick = () => onShuffle(id, mealType);
    return (
        <Card color='yellow' centered fluid>
            <Image src={imageLink} wrapped ui={false} style={{ height: "350px", overflow: "hidden" }} alt="Image of Food" />
            <Card.Content>
                <Label as='a' color='yellow' size="big" ribbon style={{ position: "absolute", top: "16px", left: "-21px" }}>
                    {mealLabel}
                </Label>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>
                    {address}
                </Card.Meta>
                <Card.Description>
                    <Button as='div' labelPosition='right'>
                        <Button basic color='grey'>
                            <Rating icon='star' rating={ratingVal} maxRating={5} disabled />
                        </Button>
                        <Label as='a' basic color='grey' pointing='left'>
                            {ratingCount}
                        </Label>
                    </Button>
                    <Button floated='right' icon='shuffle' color="yellow" loading={isShuffleLoading} onClick={handleClick} />
                </Card.Description>
            </Card.Content>
        </Card>
    );
}

