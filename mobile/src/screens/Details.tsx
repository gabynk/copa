import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { VStack, useToast, HStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

import { api } from '../services/api';

interface RouteParams {
  id: string;
}

export function Details() {
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(false);
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);

  async function fetchPoolsDetails() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);

      setPoolDetails(response.data.pools);
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

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    });
  }

  useEffect(() => {
    fetchPoolsDetails();
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0
        ? (
          <VStack px={5} flex={1}>
            <PoolHeader data={poolDetails} />

            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title="Seus palpites"
                isSelected={optionSelected === 'guesses'}
                onPress={() => setOptionSelected('guesses')}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === 'ranking'}
                onPress={() => setOptionSelected('ranking')}
              />
            </HStack>

            <Guesses poolId={poolDetails.id} code={poolDetails.code} />
          </VStack>
        ) : (
          <EmptyMyPoolList code={poolDetails.code} />
        )}
    </VStack>
  )
}