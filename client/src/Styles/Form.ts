import styled from '@emotion/styled';
import { ViewContainer } from '../Styles/View';

export const FormContainer = styled(ViewContainer)`
  display: flex; /* Ustawienie flexboxa */
  flex-direction: column; /* Układanie elementów w kolumnie */
  align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
  & > * {
    width: 50vw;
    margin: 0 0;
    padding: 1rem;
    box-sizing: border-box;  /* Zapewnia, że border nie wpływa na rozmiar elementu */
  }
`;

export const FormContent = styled.div`
display: flex; /* Ustawienie flexboxa */
flex-direction: column; /* Układanie elementów w kolumnie */
align-items: center; /* Wyśrodkowanie elementów wzdłuż osi X */
gap: 1rem;
& > * {
  width: 100%;
 }
`;