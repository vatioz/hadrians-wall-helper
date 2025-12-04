import Button from '@mui/material/Button/Button';
import styled from 'styled-components';

export const AppPrimaryButton = styled(Button)`
  border-radius: 20px !important;
  background-color: #c2442a !important;
  color: #fff !important;
  &:hover {
    background-color: #d34f34 !important;
  }
`;

export const AppOutlinePrimary = styled(Button)`
  border-radius: 20px !important;
  color: #89cff0 !important;
  background-color: white !important;

  padding-left: 3em !important;
  padding-right: 3em !important;

  &:hover {
    color: #d34f34 !important;
  }
`;

export const AppPrimaryText = styled.span<{ fontWeight?: number }>`
  color: #c2442a;
  font-weight: ${(props) => props.fontWeight || 500};
  font-size: 1.5em;
`;

export const RoundPrimaryText = styled.span<{ fontWeight?: number }>`
  color: #c2442a;
  font-weight: ${(props) => props.fontWeight || 500};
  font-size: 1.25em;
`;

export const RoundSecondaryText = styled.span<{
  fontWeight?: number;
  color?: string;
}>`
  color: ${(props) => props.color || '#c2442a'};
  font-weight: ${(props) => props.fontWeight || 500};
  font-size: 1em;
`;

export const ObjectiveExplainText = styled.span<{
  fontWeight?: number;
  fontSize?: string;
  color?: string;
}>`
  color: ${(props) => props.color || '#c2442a'};
  font-weight: ${(props) => props.fontWeight || 500};
  font-size: ${(props) => props.fontSize || '1em'};
  /* font-size: 1em; */
`;

export const ObjectiveScoreText = styled.span<{
  fontWeight?: number;
  fontSize?: string;
  color?: string;
}>`
  color: ${(props) => props.color || '#c2442a'};
  font-weight: ${(props) => props.fontWeight || 500};
  font-size: ${(props) => props.fontSize || '1em'};
  /* font-size: 1em; */
`;

export const AppText = styled.span<{
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  required?: boolean;
  maxWidth?: string;
  variant?: 'danger';
}>`
  font-size: ${(props) => props.fontSize || '1em'};
  ${(props) => props.variant === 'danger' && 'color: #f04438'}
  ${(props) => props.color && `color: ${props.color};`}
  ${(props) => props.fontWeight && `font-weight: ${props.fontWeight};`};
  ${(props) => props.maxWidth && `max-width: ${props.maxWidth};`};
  ${(props) =>
    props.required &&
    `&:after {
    content: '*';
    color: #c2442a;
  }`}
`;

export const AppLinkButton = styled.span`
  cursor: pointer;
  color: #c2442a;
  text-decoration: underline;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &:hover {
    color: rgba(194, 68, 42, 0.7);
    text-decoration-color: rgba(194, 68, 42, 0.7);
  }
`;

export const AppGradientWrapper = styled.div`
  background: linear-gradient(176.61deg, #89cff0 -4.96%, #e3c8a4 106.02%);
  min-height: 100vh;
`;

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 1.5em 1em;
  justify-content: space-between;
`;

export const AppFormFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
`;

export const AppHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin: 1em;
`;

export const AppFormCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  min-width: fit-content;
  margin: 1em;
  width: auto;

  @media (min-width: 768px) {
    padding: 1.25em;
  }
`;

export const RoundTrackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  min-width: fit-content;
  margin: 1em;
  width: auto;

  @media (min-width: 768px) {
    padding: 1.25em;
  }
`;

export const ResourceCounterCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  margin-bottom: 1em;
  height: fit-content !important;

  @media (min-width: 768px) {
    padding: 1.25em;
  }
`;

export const FateCardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  height: fit-content !important;

  @media (min-width: 768px) {
    padding: 1.25em;
  }
`;

export const PlayerCardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  overflow: auto;
  height: fit-content !important;

  @media (min-width: 768px) {
    padding: 1.25em;
  }
`;

// export const FateCardSection = styled.div`
//   /* display: flex;
//   flex-direction: column; */
//   /* gap: 1em; */
//   padding: 2em;
//   background: rgba(255, 255, 255, 0.4);
//   border-radius: 16px;
//   /* min-width: fit-content; */
//   /* max-height: fit-content; */
//   margin: 1em;
//   /* width: 24rem; */
//   /* height: 15rem; */
//   /* @media (min-width: 768px) {
//     padding: 1.25em;
//   } */
// `;

export const FlexGap = styled.div<{
  flexDirection?: 'column' | string;
  gap?: string;
  justifyContent?: string;
  alignItems?: 'start' | 'center' | 'baseline' | string;
  width?: string;
}>`
  display: flex;
  ${(props) => props.flexDirection && `flex-direction: ${props.flexDirection};`}
  ${(props) =>
    props.justifyContent && `justify-content: ${props.justifyContent};`}
  ${(props) => props.alignItems && `align-items: ${props.alignItems};`}
  ${(props) => props.width && `width: ${props.width};`}
  gap: ${(props) => props.gap || '1em'};
`;

export const LoadingOverlay = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  backgroundColor: 'white',
  opacity: '0.7',
  width: '100%',
  height: '100%',
  zIndex: 9999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
