import { FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';

import { Loading } from './Loading';
import { Game, GameProps } from './Game';
import { EmptyMyPoolList } from './EmptyMyPoolList';

import { api } from '../services/api';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);

      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Nâo foi possível carregar os detalhes do bolão.',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
      return toast.show({
        title: 'Informe o placar do palpite',
        placement: 'top',
        bgColor: 'red.500'
      });
    }

    try {
      setIsLoading(true);

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });

      toast.show({
        title: 'Palpite criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Nâo foi possível criar um palpite.',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
