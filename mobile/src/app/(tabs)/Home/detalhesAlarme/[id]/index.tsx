import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
    Container, Header, TimeToRing, PickerRow, PickerValue, PickerActive, PickerDots,
    DiasRow, DiaBtn, DiaText, BtnGravar, MiddleContent
} from './styles';
import { API_URL } from '@/constants/api';

const diasDaSemana = [
    { label: 'D', value: 'DOM' },
    { label: 'S', value: 'SEG' },
    { label: 'T', value: 'TER' },
    { label: 'Q', value: 'QUA' },
    { label: 'Q', value: 'QUI' },
    { label: 'S', value: 'SEX' },
    { label: 'S', value: 'SAB' },
];

export default function DetalheAlarmeScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [hora, setHora] = useState(17);
    const [minuto, setMinuto] = useState(10);
    const [dias, setDias] = useState<string[]>(['SEG', 'TER', 'QUA', 'QUI', 'SEX']);

    const excluirAlarme = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${API_URL}/alarmes/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Erro ao excluir alarme');
            }
            router.back();
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível excluir o alarme.');
        }
    };

    const incrementarHora = () => {
        setHora(h => (h + 1) % 24);
    };

    const decrementarHora = () => {
        setHora(h => (h + 23) % 24);
    };

    const incrementarMinuto = () => {
        setMinuto(m => (m + 1) % 60);
    };

    const decrementarMinuto = () => {
        setMinuto(m => (m + 59) % 60);
    };

    const toggleDia = (dia: string) => {
        setDias(prev =>
            prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
        );
    };

    const salvarAlteracoes = async () => {
        if (!id) return;
        const horario = `${hora.toString().padStart(2, '0')}:${minuto
            .toString()
            .padStart(2, '0')}`;

        try {
            const res = await fetch(`${API_URL}/alarmes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ horario, dias }),
            });

            if (!res.ok) {
                throw new Error('Erro ao atualizar alarme');
            }

            router.push('/(tabs)/Home');
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Não foi possível atualizar o alarme.');
        }
    };

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/alarmes/${id}`);
                const data = await res.json();
                if (data.horario) {
                    const [h, m] = data.horario.split(':').map(Number);
                    setHora(h);
                    setMinuto(m);
                }
                if (Array.isArray(data.dias)) {
                    setDias(data.dias);
                }
            } catch (err) {
                console.error('Erro ao buscar alarme:', err);
            }
        })();
    }, [id]);

    return (
        <Container>
            <Header>
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/Home')}
                    style={{ position: 'absolute', left: -28 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <TimeToRing style={{ alignSelf: 'center' }}>Tocará em 53 min.</TimeToRing>
                <TouchableOpacity
                    onPress={excluirAlarme}
                    style={{ position: 'absolute', right: -28 }}
                >
                    <Ionicons name="trash" size={28} color="#fff" />
                </TouchableOpacity>
            </Header>

            <MiddleContent>
                <PickerRow>
                    <TouchableOpacity onPress={decrementarHora}>
                        <PickerValue>{(hora + 23) % 24}</PickerValue>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={decrementarMinuto}>
                        <PickerValue>{((minuto + 59) % 60).toString().padStart(2, '0')}</PickerValue>
                    </TouchableOpacity>
                </PickerRow>
                <PickerRow>
                    <PickerActive>{hora}</PickerActive>
                    <PickerDots>:</PickerDots>
                    <PickerActive>{minuto.toString().padStart(2, '0')}</PickerActive>
                </PickerRow>
                <PickerRow>
                    <TouchableOpacity onPress={incrementarHora}>
                        <PickerValue>{(hora + 1) % 24}</PickerValue>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={incrementarMinuto}>
                        <PickerValue>{((minuto + 1) % 60).toString().padStart(2, '0')}</PickerValue>
                    </TouchableOpacity>
                </PickerRow>

                <DiasRow>
                    {diasDaSemana.map(({ label, value }, idx) => (
                        <DiaBtn
                            key={idx}
                            ativo={dias.includes(value)}
                            onPress={() => toggleDia(value)}
                        >
                            <DiaText ativo={dias.includes(value)}>{label}</DiaText>
                        </DiaBtn>
                    ))}
                </DiasRow>


                <BtnGravar onPress={salvarAlteracoes}>
                    <DiaText style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Gravar</DiaText>
                </BtnGravar>
            </MiddleContent>
        </Container>
    );
}
