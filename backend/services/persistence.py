import pandas as pd
import numpy as np

GRID = 0.01  # ~1.1 km at the equator (matching notebook Cell 15)

def add_persistence_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Groups coordinates into ~1.1 km grid cells and computes:
    - detection_count: total historical hits
    - distinct_days: unique observation calendar days
    - active_span_days: (last_seen - first_seen).days + 1
    """
    df = df.copy()
    df["grid_lat"] = (df["latitude"] / GRID).round().astype(int)
    df["grid_lon"] = (df["longitude"] / GRID).round().astype(int)
    df["grid_cell"] = df["grid_lat"].astype(str) + "_" + df["grid_lon"].astype(str)

    if not pd.api.types.is_datetime64_any_dtype(df["acq_datetime"]):
        df["acq_datetime"] = pd.to_datetime(df["acq_datetime"], errors="coerce")

    persist = (
        df.groupby("grid_cell")["acq_datetime"]
        .agg(
            detection_count="count",
            distinct_days=lambda s: s.dt.date.nunique(),
            first_seen="min",
            last_seen="max",
        )
    )
    persist["active_span_days"] = (persist["last_seen"] - persist["first_seen"]).dt.days + 1

    df = df.merge(persist, on="grid_cell", how="left")
    return df
